import { IRepositoryProvider } from '../../../../../../shared/infra/orm/providers/repository.provider';
import { EventActivityPresence } from '../../entities/event-activity-presence.entity';

interface IEventActivityPresenceRepositoryProvider extends IRepositoryProvider<EventActivityPresence> {
  createMany(data: Partial<EventActivityPresence>[]): Promise<EventActivityPresence[]>;
}
export { IEventActivityPresenceRepositoryProvider };
