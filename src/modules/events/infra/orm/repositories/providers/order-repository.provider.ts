import IRepositoryProvider from '../../../../../../shared/infra/orm/infra/providers/repository.provider';
import Order from '../../entities/order.entity';

interface IOrderRepositoryProvider extends IRepositoryProvider<Order> {}

export default IOrderRepositoryProvider;
