import { IOrderRepositoryProvider } from '../providers/order-repository.provider';
import { CreatePendingOrderAttemptDTO } from '../../../../dtos/internal/repositories/create-pending-order-attempt.dto';
import { CreatePendingOrderAttemptResultDTO } from '../../../../dtos/internal/repositories/create-pending-order-attempt-result.dto';
import { CreatePendingOrderAttemptOutcomeDTO } from '../../../../dtos/internal/repositories/create-pending-order-attempt-outcome.dto';
import { ConfirmPaidOrderDTO } from '../../../../dtos/internal/repositories/confirm-paid-order.dto';
import { ConfirmPaidOrderResultDTO } from '../../../../dtos/internal/repositories/confirm-paid-order-result.dto';
import { Order } from '../../entities/order.entity';
import { OrderQueryOptionsDTO } from '../../../../dtos/incoming/http/order/order-query-options.dto';
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

  public async find(data: Partial<OrderQueryOptionsDTO>): Promise<Order[]> {
    const query = this.repository.createQueryBuilder('order');

    query.leftJoinAndSelect('order.user', 'user');
    query.leftJoinAndSelect('order.tickets', 'ticket');
    query.leftJoinAndSelect('order.payments', 'payments');
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

  public async confirmPaidOrder(data: ConfirmPaidOrderDTO): Promise<ConfirmPaidOrderResultDTO> {
    return dataSource.transaction(async manager => {
      const payment = await manager
        .createQueryBuilder(Payment, 'payment')
        .innerJoinAndSelect('payment.order', 'payment_order')
        .where('payment.id = :paymentId', { paymentId: data.payment_id })
        .setLock('pessimistic_write')
        .getOne();

      if (!payment) {
        return { status: 'payment_not_found' };
      }

      const order = await manager
        .createQueryBuilder(Order, 'order')
        .where('order.id = :orderId', { orderId: data.order_id })
        .setLock('pessimistic_write')
        .getOne();

      if (!order) {
        return { status: 'order_not_found' };
      }

      if (payment.order.id !== data.order_id) {
        return { status: 'payment_order_mismatch' };
      }

      const paymentAlreadyPaid = payment.status === PaymentStatus.PAID;
      const orderAlreadyConfirmed = order.status === OrderStatus.CONFIRMED;

      if (paymentAlreadyPaid && orderAlreadyConfirmed) {
        return { status: 'already_confirmed' };
      }

      if (!paymentAlreadyPaid) {
        await manager.update(Payment, payment.id, {
          status: PaymentStatus.PAID,
          paid_at: new Date(),
        });
      }

      if (order.status === OrderStatus.PENDING) {
        await manager.update(Order, order.id, { status: OrderStatus.CONFIRMED });
      }

      return { status: 'confirmed' };
    });
  }

  public async createPendingOrderAttempt(
    data: CreatePendingOrderAttemptDTO,
  ): Promise<CreatePendingOrderAttemptOutcomeDTO> {
    return dataSource.transaction(async manager => {
      for (const eventActivityId of data.event_activity_ids) {
        const eventActivity = await manager
          .createQueryBuilder(EventActivity, 'event_activity')
          .where('event_activity.id = :id', { id: eventActivityId })
          .andWhere('event_activity.event_id = :event_id', { event_id: data.event_id })
          .setLock('pessimistic_write')
          .getOne();

        if (!eventActivity) {
          return { status: 'activity_not_found', event_activity_id: eventActivityId };
        }

        const existingPresence = await manager
          .createQueryBuilder(EventActivityPresence, 'presence')
          .where('presence.event_activity_id = :eventActivityId', { eventActivityId })
          .andWhere('presence.user_id = :userId', { userId: data.user_id })
          .getOne();

        if (existingPresence) {
          return { status: 'already_registered', event_activity_id: eventActivityId };
        }

        if (eventActivity.max_participants != null) {
          const presenceCount = await manager
            .createQueryBuilder(EventActivityPresence, 'presence')
            .where('presence.event_activity_id = :eventActivityId', { eventActivityId })
            .getCount();

          if (presenceCount >= eventActivity.max_participants) {
            return { status: 'max_participants', event_activity_id: eventActivityId };
          }
        }
      }

      const batch = await manager
        .createQueryBuilder(Batch, 'batch')
        .where('batch.event_id = :event_id', { event_id: data.event_id })
        .orderBy('batch.price', 'ASC')
        .setLock('pessimistic_write')
        .getOne();

      if (!batch) {
        return { status: 'no_tickets' };
      }

      const issuedCount = await manager
        .createQueryBuilder(Ticket, 'ticket')
        .where('ticket.batch_id = :batchId', { batchId: batch.id })
        .getCount();

      if (issuedCount >= batch.base_quantity) {
        return { status: 'no_tickets' };
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

      const result: CreatePendingOrderAttemptResultDTO = {
        ticket: {
          ...ticket,
          batch,
          order,
        } as Ticket,
        order,
        presences,
      };

      return { status: 'success', data: result };
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

  public async refundPaidOrder(orderId: string, paymentId: string): Promise<void> {
    await dataSource.transaction(async manager => {
      const order = await manager.findOne(Order, { where: { id: orderId } });

      if (!order || order.status === OrderStatus.REFUNDED) {
        return;
      }

      await manager.delete(EventActivityPresence, { order: { id: orderId } });

      await manager.update(Order, orderId, { status: OrderStatus.REFUNDED });

      await manager.softDelete(Ticket, { order: { id: orderId } });

      await manager.update(Payment, paymentId, {
        status: PaymentStatus.REFUNDED,
        refunded_at: new Date(),
      });
    });
  }

  public async disputeOrder(orderId: string, paymentId: string): Promise<void> {
    await dataSource.transaction(async manager => {
      await manager.update(Order, orderId, { status: OrderStatus.DISPUTED });

      await manager.update(Payment, paymentId, {
        status: PaymentStatus.DISPUTED,
      });
    });
  }

  public async loseDisputedOrder(orderId: string, paymentId: string): Promise<void> {
    await dataSource.transaction(async manager => {
      await manager.delete(EventActivityPresence, { order: { id: orderId } });

      await manager.update(Order, orderId, { status: OrderStatus.CANCELLED });

      await manager.softDelete(Ticket, { order: { id: orderId } });

      await manager.update(Payment, paymentId, {
        status: PaymentStatus.FAILED,
      });
    });
  }
}
export { OrderRepository };
