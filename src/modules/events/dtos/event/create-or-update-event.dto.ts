import { Event } from '../../infra/orm/entities/event.entity';
import { EventStatus } from '../../infra/orm/enums/event-status.enum';

interface CreateOrUpdateEventDTO extends Omit<Event, 'status'> {
  organization_id: string;
  status: EventStatus;
}
export { CreateOrUpdateEventDTO };
