import { inject, injectable } from 'tsyringe';
import OrderQueryOptions from '../../dtos/order/order-query-options';
import IOrderRepositoryProvider from '../../infra/orm/repositories/providers/order-repository.provider';

@injectable()
export class FindOrdersService {
  constructor(
    @inject('OrderRepositoryProvider')
    private orderRepository: IOrderRepositoryProvider,
  ) {}

  public async execute(options: Partial<OrderQueryOptions>) {
    const orders = await this.orderRepository.find(options);
    return { message: 'Orders found successfully.', data: orders };
  }
}
