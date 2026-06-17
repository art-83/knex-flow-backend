import { OrganizationRole } from '../../infra/orm/entities/organization-role.entity';

interface CreateOrUpdateOrganizationRoleDTO extends OrganizationRole {
  name: string;
  description: string;
  organization_id: string;
}
export { CreateOrUpdateOrganizationRoleDTO };
