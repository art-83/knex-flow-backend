import { inject, injectable } from 'tsyringe';
import IOrganizationRoleRepositoryProvider from '../../infra/orm/repositories/providers/organization-role-repository.provider';
import AppError from '../../../../shared/infra/http/errors/app-error';
import OrganizationRoleQueryOptions from '../../dtos/organization-role/organization-role-query-options';
import EnsureUserCanActOnOrganizationService from '../../../../shared/infra/http/authorization/ensure-user-can-act-on-organization.service';
import PermissionDescriptionEnum from '../../enums/permission-description.enum';

@injectable()
class FindOrganizationRolesService {
  constructor(
    @inject('OrganizationRoleRepositoryProvider')
    private organizationRoleRepository: IOrganizationRoleRepositoryProvider,
    private ensureUserCanActOnOrganizationService: EnsureUserCanActOnOrganizationService,
  ) {}

  public async execute(user_id: string, data: Partial<OrganizationRoleQueryOptions>) {
    if (!data.organization_id) {
      throw new AppError(400, 'organization_id is required.', 'organization_id e obrigatorio.');
    }

    await this.ensureUserCanActOnOrganizationService.execute(
      user_id,
      data.organization_id,
      PermissionDescriptionEnum.ORGANIZATION_ROLE_READ,
    );

    const organizationRoles = await this.organizationRoleRepository.find(data);

    return {
      message: 'Organization roles retrieved successfully.',
      data: organizationRoles,
    };
  }
}

export default FindOrganizationRolesService;
