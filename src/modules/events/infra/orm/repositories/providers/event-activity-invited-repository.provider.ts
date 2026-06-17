import { IRepositoryProvider } from '../../../../../../shared/infra/orm/providers/repository.provider';
import { EventActivityInvited } from '../../entities/event-activity-invited.entity';

interface IEventActivityInvitedRepositoryProvider extends IRepositoryProvider<EventActivityInvited> {}
export { IEventActivityInvitedRepositoryProvider };
