import { Event } from '../../infra/orm/entities/event.entity';

interface CreateOrUpdateEventDTO extends Event {
  organization_id: string;
}

export default CreateOrUpdateEventDTO;
