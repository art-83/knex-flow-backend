import { OrganizationRolePermission } from '../../infra/orm/entities/organization-role-permission.entity';

interface CreateOrUpdateOrganizationRolePermissionDTO extends OrganizationRolePermission {
  organization_role_id: string;
  permission_id: string;
}

export default CreateOrUpdateOrganizationRolePermissionDTO;
