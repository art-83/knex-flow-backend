import { EventActivity } from '../../../../infra/orm/entities/event-activity.entity';

interface CreateOrUpdateEventActivityDTO extends EventActivity {
  event_id: string;
  file_id?: string | null;
}
export { CreateOrUpdateEventActivityDTO };
