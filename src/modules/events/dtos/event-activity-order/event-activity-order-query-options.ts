import { DefaultQueryOptionsDTO } from '../../../../shared/infra/orm/dtos/default-query-options.dto';
import { EventActivityPresence } from '../../infra/orm/entities/event-activity-presence.entity';

interface EventActivityOrderQueryOptions extends EventActivityPresence, DefaultQueryOptionsDTO {
  event_activity_id: string;
  order_id: string;
}
export { EventActivityOrderQueryOptions };
