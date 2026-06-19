import { DefaultQueryOptionsDTO } from '../../../../../../shared/dtos/incoming/http/query/default-query-options.dto';
import { Event } from '../../../../infra/orm/entities/event.entity';

interface EventQueryOptionsDTO extends Event, DefaultQueryOptionsDTO {
  organization_id: string;
}
export { EventQueryOptionsDTO };
