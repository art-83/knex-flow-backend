import { inject, injectable } from 'tsyringe';
import { IOrderRepositoryProvider } from '../../infra/orm/repositories/providers/order-repository.provider';
import { OrderQueryOptions } from '../../dtos/order/order-query-options';

@injectable()
class FindUserOrdersService {
  constructor(
    @inject('OrderRepositoryProvider')
    private orderRepository: IOrderRepositoryProvider,
  ) {}

  async execute(user_id: string, options: Partial<OrderQueryOptions>) {
    const queryOptions = {
      user_id,
      ...options,
    } as Partial<OrderQueryOptions>;
    const orders = await this.orderRepository.find(queryOptions);
    return {
      message: 'User orders found successfully.',
      data: orders,
    };
  }
}
export { FindUserOrdersService };
