import { EventActivityPresence } from '../../../infra/orm/entities/event-activity-presence.entity';
import { MarkPresenceCheckInOutcomeStatus } from '../../../infra/orm/enums/mark-presence-check-in-outcome-status.enum';

interface MarkPresenceCheckInOutcomeDTO {
  status: MarkPresenceCheckInOutcomeStatus;
  presence?: EventActivityPresence;
}
export { MarkPresenceCheckInOutcomeDTO };
