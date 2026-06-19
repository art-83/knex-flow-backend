import { DefaultQueryOptionsDTO } from '../../../../../../shared/dtos/incoming/http/query/default-query-options.dto';
import { EventActivityPresence } from '../../../../infra/orm/entities/event-activity-presence.entity';

interface EventActivityPresenceQueryOptionsDTO extends EventActivityPresence, DefaultQueryOptionsDTO {
  event_activity_id: string;
  user_id: string;
  order_id: string;
}
export { EventActivityPresenceQueryOptionsDTO };
