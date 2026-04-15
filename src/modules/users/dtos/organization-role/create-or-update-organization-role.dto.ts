import { OrganizationRole } from '../../infra/orm/entities/organization-role.entity';

interface CreateOrUpdateOrganizationRoleDTO extends OrganizationRole {
  organization_id: string;
}

export default CreateOrUpdateOrganizationRoleDTO;
