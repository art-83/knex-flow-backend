import { Event } from '../../infra/orm/entities/event.entity';

interface CreateOrUpdateEventDTO extends Event {
  // TODO: quando Organization virar @ManyToOne, declarar organization_id: string aqui
}

export default CreateOrUpdateEventDTO;
