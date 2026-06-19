import { IOrderRepositoryProvider } from '../providers/order-repository.provider';
import {
  CreatePendingOrderAttemptDTO,
  CreatePendingOrderAttemptResult,
} from '../../../../dtos/order/create-pending-order-attempt.dto';
import { Order } from '../../entities/order.entity';
import { OrderQueryOptions } from '../../../../dtos/order/order-query-options';
import { OrderStatus } from '../../enums/order-status.enum';
import { Ticket } from '../../entities/ticket.entity';
import { Batch } from '../../entities/batch.entity';
import { Payment } from '../../../../../payments/infra/orm/entities/payment.entity';
import { PaymentStatus } from '../../../../../payments/infra/orm/enums/payment-status.enum';
import { EventActivityPresence } from '../../entities/event-activity-presence.entity';
import { User } from '../../../../../users/infra/orm/entities/user.entity';
import { EventActivity } from '../../entities/event-activity.entity';
import { Repository } from 'typeorm';
import { dataSource } from '../../../../../../shared/infra/orm/database';

class OrderRepository implements IOrderRepositoryProvider {
  private repository: Repository<Order>;

  constructor() {
    this.repository = dataSource.getRepository(Order);
  }

  public async find(data: Partial<OrderQueryOptions>): Promise<Order[]> {
    const query = this.repository.createQueryBuilder('order');

    query.leftJoinAndSelect('order.user', 'user');
    query.leftJoinAndSelect('order.tickets', 'ticket');
    query.leftJoinAndSelect('ticket.batch', 'batch');
    query.leftJoinAndSelect('batch.event', 'event');

    if (data.id) query.andWhere('order.id = :id', { id: data.id });

    if (data.user_id) query.andWhere('order.user_id = :user_id', { user_id: data.user_id });

    if (data.total_amount) query.andWhere('order.total_amount = :total_amount', { total_amount: data.total_amount });

    if (data.status) query.andWhere('order.status = :status', { status: data.status });

    if (data.event_id) {
      query.andWhere('batch.event_id = :event_id', { event_id: data.event_id });
      query.distinct(true);
    }

    if (data.created_at) query.andWhere('order.created_at = :created_at', { created_at: data.created_at });

    if (data.updated_at) query.andWhere('order.updated_at = :updated_at', { updated_at: data.updated_at });

    if (data.start_date) query.andWhere('order.created_at >= :start_date', { start_date: data.start_date });

    if (data.end_date) query.andWhere('order.created_at <= :end_date', { end_date: data.end_date });

    if (data.limit) query.limit(data.limit);
    if (data.offset) query.offset(data.offset);

    return await query.getMany();
  }

  public async create(data: Order): Promise<Order> {
    const create = this.repository.create(data);
    return await this.repository.save(create);
  }

  public async update(id: string, data: Partial<Order>): Promise<Order> {
    const create = this.repository.create(data);
    await this.repository.update(id, create);
    return create;
  }

  public async delete(id: string): Promise<number> {
    const deleteResult = await this.repository.softDelete(id);
    return Number(deleteResult.affected);
  }

  public async createPendingOrderAttempt(
    data: CreatePendingOrderAttemptDTO,
  ): Promise<CreatePendingOrderAttemptResult | null> {
    return dataSource.transaction(async manager => {
      const batch = await manager
        .createQueryBuilder(Batch, 'batch')
        .where('batch.event_id = :event_id', { event_id: data.event_id })
        .orderBy('batch.price', 'ASC')
        .setLock('pessimistic_write')
        .getOne();

      if (!batch) {
        return null;
      }

      const issuedCount = await manager
        .createQueryBuilder(Ticket, 'ticket')
        .where('ticket.batch_id = :batchId', { batchId: batch.id })
        .getCount();

      if (issuedCount >= batch.base_quantity) {
        return null;
      }

      const order = await manager.save(
        Order,
        manager.create(Order, {
          user: { id: data.user_id } as User,
          total_amount: batch.price,
          status: OrderStatus.PENDING,
        }),
      );

      const ticket = await manager.save(
        Ticket,
        manager.create(Ticket, {
          batch: { id: batch.id } as Batch,
          order: { id: order.id } as Order,
        }),
      );

      const presences: EventActivityPresence[] = [];

      for (const eventActivityId of data.event_activity_ids) {
        const presence = await manager.save(
          EventActivityPresence,
          manager.create(EventActivityPresence, {
            user: { id: data.user_id } as User,
            order: { id: order.id } as Order,
            event_activity: { id: eventActivityId } as EventActivity,
            user_presence: false,
          }),
        );

        presences.push(presence);
      }

      return {
        ticket: {
          ...ticket,
          batch,
          order,
        } as Ticket,
        order,
        presences,
      };
    });
  }

  public async expirePendingOrder(orderId: string): Promise<void> {
    await dataSource.transaction(async manager => {
      await manager.delete(EventActivityPresence, { order: { id: orderId } });

      await manager.update(Order, orderId, { status: OrderStatus.EXPIRED });

      await manager.softDelete(Ticket, { order: { id: orderId } });

      await manager
        .createQueryBuilder()
        .update(Payment)
        .set({ status: PaymentStatus.EXPIRED })
        .where('order_id = :orderId', { orderId })
        .andWhere('status = :status', { status: PaymentStatus.PENDING })
        .execute();
    });
  }
}
export { OrderRepository };
