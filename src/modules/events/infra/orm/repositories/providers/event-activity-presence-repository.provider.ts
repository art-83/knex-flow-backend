import { IRepositoryProvider } from '../../../../../../shared/infra/orm/providers/repository.provider';
import { EventActivityPresenceQueryOptions } from '../../../../dtos/event-activity-presence/event-activity-presence-query-options';
import { EventActivityPresence } from '../../entities/event-activity-presence.entity';

interface IEventActivityPresenceRepositoryProvider extends IRepositoryProvider<EventActivityPresence> {
  find(data: Partial<EventActivityPresenceQueryOptions>): Promise<EventActivityPresence[]>;
  createMany(data: Partial<EventActivityPresence>[]): Promise<EventActivityPresence[]>;
}
export { IEventActivityPresenceRepositoryProvider };
