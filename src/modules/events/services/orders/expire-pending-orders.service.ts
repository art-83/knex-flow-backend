import { inject, injectable } from 'tsyringe';
import { IOrderRepositoryProvider } from '../../infra/orm/repositories/providers/order-repository.provider';
import { OrderStatus } from '../../infra/orm/enums/order-status.enum';
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
      await this.orderRepository.expirePendingOrder(order.id);
      expiredCount++;
    }

    return { expired_count: expiredCount };
  }
}
export { ExpirePendingOrdersService };
