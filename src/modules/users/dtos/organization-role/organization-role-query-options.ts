import { DefaultQueryOptionsDTO } from '../../../../shared/infra/orm/dtos/default-query-options.dto';
import { OrganizationRole } from '../../infra/orm/entities/organization-role.entity';

interface OrganizationRoleQueryOptions extends OrganizationRole, DefaultQueryOptionsDTO {
  organization_id: string;
}
export { OrganizationRoleQueryOptions };
