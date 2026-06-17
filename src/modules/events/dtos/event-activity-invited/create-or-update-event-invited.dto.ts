import { EventActivityInvited } from '../../infra/orm/entities/event-activity-invited.entity';

interface CreateOrUpdateEventInvitedDTO extends EventActivityInvited {
  event_activity_id: string;
  user_id: string;
}
export { CreateOrUpdateEventInvitedDTO };
