import DefaultQueryOptionsDTO from '../../../../shared/infra/orm/dtos/default-query-options.dto';
import { Event } from '../../infra/orm/entities/event.entity';

interface EventQueryOptions extends Event, DefaultQueryOptionsDTO {
  organization_id: string;
}

export default EventQueryOptions;
