import IRepositoryProvider from '../../../../../../shared/infra/orm/repositories/providers/repository.provider';
import EventActivityOrder from '../../entities/event-activity-order.entity';

interface IEventActivityOrderRepositoryProvider extends IRepositoryProvider<EventActivityOrder> {
  createMany(data: Partial<EventActivityOrder>[]): Promise<EventActivityOrder[]>;
}

export default IEventActivityOrderRepositoryProvider;
