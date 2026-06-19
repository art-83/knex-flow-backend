import { DefaultQueryOptionsDTO } from '../../../../../../shared/dtos/incoming/http/query/default-query-options.dto';

interface PublicEventQueryOptionsDTO extends DefaultQueryOptionsDTO {
  id: string;
  organization_id: string;
  url_path: string;
}
export { PublicEventQueryOptionsDTO };
