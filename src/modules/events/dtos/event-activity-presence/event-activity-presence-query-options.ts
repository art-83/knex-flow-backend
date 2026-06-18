import { DefaultQueryOptionsDTO } from '../../../../shared/infra/orm/dtos/default-query-options.dto';

interface CreateEventActivityPresenceDTO {
  user_id: string;
  event_activity_id: string;
}

interface EventActivityPresenceQueryOptions extends DefaultQueryOptionsDTO {
  id?: string;
  event_activity_id?: string;
  user_id?: string;
}
export { CreateEventActivityPresenceDTO, EventActivityPresenceQueryOptions };
