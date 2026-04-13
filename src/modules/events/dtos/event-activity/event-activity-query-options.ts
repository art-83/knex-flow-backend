import DefaultQueryOptionsDTO from '../../../../shared/infra/orm/dtos/default-query-options.dto';
import { EventActivity } from '../../infra/orm/entities/event-activity.entity';

interface EventActivityQueryOptions extends EventActivity, DefaultQueryOptionsDTO {
  event_id: string;
  activity_id: string;
}

export default EventActivityQueryOptions;
