import { DefaultQueryOptionsDTO } from '../../../../../../shared/dtos/incoming/http/query/default-query-options.dto';
import { EventActivityInvited } from '../../../../infra/orm/entities/event-activity-invited.entity';

interface EventActivityInvitedQueryOptionsDTO extends EventActivityInvited, DefaultQueryOptionsDTO {
  event_id: string;
  event_activity_id: string;
  user_id: string;
}
export { EventActivityInvitedQueryOptionsDTO };
