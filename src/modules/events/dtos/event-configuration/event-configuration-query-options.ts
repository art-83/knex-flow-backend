import { DefaultQueryOptionsDTO } from '../../../../shared/infra/orm/dtos/default-query-options.dto';
import { EventConfiguration } from '../../infra/orm/entities/event-configuration.entity';

interface EventConfigurationQueryOptions extends EventConfiguration, DefaultQueryOptionsDTO {
  event_id: string;
}
export { EventConfigurationQueryOptions };
