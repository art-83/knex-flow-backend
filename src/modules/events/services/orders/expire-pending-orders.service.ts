import { inject, injectable } from 'tsyringe';
import { EntityManager } from 'typeorm';
import { IOrderRepositoryProvider } from '../../infra/orm/repositories/providers/order-repository.provider';
import { OrderStatus } from '../../infra/orm/enums/order-status.enum';
import { Order } from '../../infra/orm/entities/order.entity';
import { Ticket } from '../../infra/orm/entities/ticket.entity';
import { Payment } from '../../../payments/infra/orm/entities/payment.entity';
import { PaymentStatus } from '../../../payments/infra/orm/enums/payment-status.enum';
import { dataSource } from '../../../../shared/infra/orm/database';
import { orderConfig } from '../../../../config/order.config';
import { OrderQueryOptions } from '../../dtos/order/order-query-options';

@injectable()
class ExpirePendingOrdersService {
  constructor(
    @inject('OrderRepositoryProvider')
    private orderRepository: IOrderRepositoryProvider,
  ) {}

  public async execute(): Promise<{ expired_count: number }> {
    const cutoff = new Date(Date.now() - orderConfig.pendingTtlMinutes * 60 * 1000);

    const orders = await this.orderRepository.find({
      status: OrderStatus.PENDING,
      end_date: cutoff,
    } as Partial<OrderQueryOptions>);

    let expiredCount = 0;

    for (const order of orders) {
      await dataSource.transaction(async manager => {
        await this.expireOrder(manager, order.id);
      });
      expiredCount++;
    }

    return { expired_count: expiredCount };
  }

  private async expireOrder(manager: EntityManager, orderId: string): Promise<void> {
    await manager.update(Order, orderId, { status: OrderStatus.EXPIRED });

    await manager
      .createQueryBuilder()
      .update(Ticket)
      .set({ order: null })
      .where('order_id = :orderId', { orderId })
      .execute();

    await manager
      .createQueryBuilder()
      .update(Payment)
      .set({ status: PaymentStatus.EXPIRED })
      .where('order_id = :orderId', { orderId })
      .andWhere('status = :status', { status: PaymentStatus.PENDING })
      .execute();
  }
}
export { ExpirePendingOrdersService };
