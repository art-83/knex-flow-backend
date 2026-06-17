import { DefaultQueryOptionsDTO } from '../../../../shared/infra/orm/dtos/default-query-options.dto';
import { EventActivityInvited } from '../../infra/orm/entities/event-activity-invited.entity';

interface EventActivityInvitedQueryOptions extends EventActivityInvited, DefaultQueryOptionsDTO {
  event_id: string;
  event_activity_id: string;
  user_id: string;
}
export { EventActivityInvitedQueryOptions };
