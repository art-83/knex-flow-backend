import { DefaultQueryOptionsDTO } from '../../../../../../shared/dtos/incoming/http/query/default-query-options.dto';
import { OrganizationRole } from '../../../../infra/orm/entities/organization-role.entity';

interface OrganizationRoleQueryOptionsDTO extends OrganizationRole, DefaultQueryOptionsDTO {
  organization_id: string;
}
export { OrganizationRoleQueryOptionsDTO };
