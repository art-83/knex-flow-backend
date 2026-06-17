import { UserOrganization } from '../../infra/orm/entities/user-organization.entity';

interface CreateOrUpdateUserOrganizationDTO extends UserOrganization {
  user_id: string;
  organization_id: string;
}
export { CreateOrUpdateUserOrganizationDTO };
