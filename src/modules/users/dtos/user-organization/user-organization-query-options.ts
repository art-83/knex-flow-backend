import { DefaultQueryOptionsDTO } from '../../../../shared/infra/orm/dtos/default-query-options.dto';
import { UserOrganization } from '../../infra/orm/entities/user-organization.entity';

interface UserOrganizationQueryOptions extends UserOrganization, DefaultQueryOptionsDTO {
  user_id: string;
  organization_id: string;
}
export { UserOrganizationQueryOptions };
