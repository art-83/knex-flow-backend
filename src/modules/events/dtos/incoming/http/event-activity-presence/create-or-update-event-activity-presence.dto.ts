import { EventActivityPresence } from '../../../../infra/orm/entities/event-activity-presence.entity';

interface CreateOrUpdateEventActivityPresenceDTO extends EventActivityPresence {
  user_id: string;
  event_activity_id: string;
  order_id: string;
}
export { CreateOrUpdateEventActivityPresenceDTO };
