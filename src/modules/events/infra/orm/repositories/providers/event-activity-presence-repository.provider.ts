import { IRepositoryProvider } from '../../../../../../shared/infra/orm/providers/repository.provider';
import { EventActivityPresence } from '../../entities/event-activity-presence.entity';
import { MarkPresenceCheckInDTO } from '../../../../dtos/internal/repositories/mark-presence-check-in.dto';
import { MarkPresenceCheckInOutcomeDTO } from '../../../../dtos/internal/repositories/mark-presence-check-in-outcome.dto';

interface IEventActivityPresenceRepositoryProvider extends IRepositoryProvider<EventActivityPresence> {
  countByEventActivity(event_activity_id: string): Promise<number>;
  deleteByOrderId(order_id: string): Promise<void>;
  markPresenceCheckIn(data: MarkPresenceCheckInDTO): Promise<MarkPresenceCheckInOutcomeDTO>;
}
export { IEventActivityPresenceRepositoryProvider };
