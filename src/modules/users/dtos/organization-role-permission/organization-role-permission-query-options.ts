import DefaultQueryOptionsDTO from '../../../../shared/infra/orm/dtos/default-query-options.dto';
import { OrganizationRolePermission } from '../../infra/orm/entities/organization-role-permission.entity';

interface OrganizationRolePermissionQueryOptions extends OrganizationRolePermission, DefaultQueryOptionsDTO {
  organization_role_id: string;
  permission_id: string;
}

export default OrganizationRolePermissionQueryOptions;
