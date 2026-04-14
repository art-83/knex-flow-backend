import { EventConfiguration } from '../../infra/orm/entities/event-configuration.entity';

interface CreateOrUpdateEventConfigurationDTO extends EventConfiguration {
  event_id: string;
}

export default CreateOrUpdateEventConfigurationDTO;
