import { IRepositoryProvider } from '../../../../../../shared/infra/orm/providers/repository.provider';
import { EventActivityPresence } from '../../entities/event-activity-presence.entity';

interface IEventActivityPresenceRepositoryProvider extends IRepositoryProvider<EventActivityPresence> {
  countByEventActivity(event_activity_id: string): Promise<number>;
  deleteByOrderId(order_id: string): Promise<void>;
}
export { IEventActivityPresenceRepositoryProvider };
