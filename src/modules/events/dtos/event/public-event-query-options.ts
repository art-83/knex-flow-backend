import { DefaultQueryOptionsDTO } from '../../../../shared/infra/orm/dtos/default-query-options.dto';

interface PublicEventQueryOptions extends DefaultQueryOptionsDTO {
  id: string;
  organization_id: string;
  url_path: string;
}
export { PublicEventQueryOptions };
