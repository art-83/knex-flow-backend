import { DefaultQueryOptionsDTO } from '../../../../shared/infra/orm/dtos/default-query-options.dto';
import { EventActivityPresence } from '../../infra/orm/entities/event-activity-presence.entity';

interface EventActivityPresenceQueryOptions extends EventActivityPresence, DefaultQueryOptionsDTO {
  event_activity_id: string;
  order_id: string;
}
export { EventActivityPresenceQueryOptions };
