import { inject, injectable } from 'tsyringe';
import CreateOrUpdateOrderDTO from '../../dtos/order/create-or-update-order.dto';
import IOrderRepositoryProvider from '../../infra/orm/repositories/providers/order-repository.provider';

@injectable()
export class UpdateOrderService {
  constructor(
    @inject('OrderRepositoryProvider')
    private orderRepository: IOrderRepositoryProvider,
  ) {}

  public async execute(order_id: string, data: Partial<CreateOrUpdateOrderDTO>) {
    const order = await this.orderRepository.update(order_id, data);
    return { message: 'Order updated successfully.', data: order };
  }
}
