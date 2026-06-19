import { OrganizationConfigurationDTO } from '../../../../dtos/internal/domain/organization-configuration.dto';

interface UpdateOrganizationRequestDTO {
  configuration?: Partial<OrganizationConfigurationDTO>;
}
export { UpdateOrganizationRequestDTO };
