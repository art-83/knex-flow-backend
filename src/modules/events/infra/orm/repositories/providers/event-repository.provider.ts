import IRepositoryProvider from '../../../../../../shared/infra/orm/infra/providers/repository.provider';
import Event from '../../entities/event.entity';

interface IEventRepositoryProvider extends IRepositoryProvider<Event> {}

export default IEventRepositoryProvider;
