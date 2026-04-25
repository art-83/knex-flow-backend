import { inject, injectable } from 'tsyringe';
import IOrderRepositoryProvider from '../../infra/orm/repositories/providers/order-repository.provider';

@injectable()
export class DeleteOrderService {
  constructor(
    @inject('OrderRepositoryProvider')
    private orderRepository: IOrderRepositoryProvider,
  ) {}

  public async execute(order_id: string) {
    const rowsDeleted = await this.orderRepository.delete(order_id);
    return { message: 'Order deleted successfully.', deleted: rowsDeleted };
  }
}
