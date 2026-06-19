import { DefaultQueryOptionsDTO } from '../../../../../../shared/dtos/incoming/http/query/default-query-options.dto';
import { EventActivity } from '../../../../infra/orm/entities/event-activity.entity';

interface EventActivityQueryOptionsDTO extends EventActivity, DefaultQueryOptionsDTO {
  event_id: string;
}
export { EventActivityQueryOptionsDTO };
