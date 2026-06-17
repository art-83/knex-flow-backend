import { EventActivity } from '../../infra/orm/entities/event-activity.entity';

interface CreateOrUpdateEventActivityDTO extends EventActivity {
  event_id: string;
  activity_id: string;
}
export { CreateOrUpdateEventActivityDTO };
