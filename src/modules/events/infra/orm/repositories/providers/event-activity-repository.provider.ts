import IRepositoryProvider from '../../../../../../shared/infra/orm/infra/providers/repository.provider';
import EventActivity from '../../entities/event-activity.entity';

interface IEventActivityRepositoryProvider extends IRepositoryProvider<EventActivity> {}

export default IEventActivityRepositoryProvider;
