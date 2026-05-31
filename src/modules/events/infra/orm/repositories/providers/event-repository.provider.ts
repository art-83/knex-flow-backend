import IRepositoryProvider from '../../../../../../shared/infra/orm/providers/repository.provider';
import Event from '../../entities/event.entity';

interface IEventRepositoryProvider extends IRepositoryProvider<Event> {}

export default IEventRepositoryProvider;
