import { DefaultQueryOptionsDTO } from '../../../../../../shared/dtos/incoming/http/query/default-query-options.dto';
import { UserOrganization } from '../../../../infra/orm/entities/user-organization.entity';

interface UserOrganizationQueryOptionsDTO extends UserOrganization, DefaultQueryOptionsDTO {
  user_id: string;
  organization_id: string;
}
export { UserOrganizationQueryOptionsDTO };
