import { IRepositoryProvider } from '../../../../../../shared/infra/orm/providers/repository.provider';
import { Order } from '../../entities/order.entity';

interface IOrderRepositoryProvider extends IRepositoryProvider<Order> {
  expirePendingOrder(orderId: string): Promise<void>;
}
export { IOrderRepositoryProvider };
