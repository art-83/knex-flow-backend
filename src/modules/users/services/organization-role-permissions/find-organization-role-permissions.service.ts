import { inject, injectable } from 'tsyringe';
import { IOrganizationRolePermissionRepositoryProvider } from '../../infra/orm/repositories/providers/organization-role-permission-repository.provider';
import { AppError } from '../../../../shared/infra/http/errors/app-error';
import { OrganizationRolePermissionQueryOptions } from '../../dtos/organization-role-permission/organization-role-permission-query-options';
import { AuthorizeOrganizationActionService } from '../../../../shared/infra/http/authorization';
import { PermissionDescriptionEnum } from '../../infra/orm/enums/permission-description.enum';

@injectable()
class FindOrganizationRolePermissionsService {
  constructor(
    @inject('OrganizationRolePermissionRepositoryProvider')
    private organizationRolePermissionRepository: IOrganizationRolePermissionRepositoryProvider,
    private authorizeOrganizationActionService: AuthorizeOrganizationActionService,
  ) {}

  public async execute(user_id: string, data: Partial<OrganizationRolePermissionQueryOptions>) {
    if (!data.organization_id) {
      throw new AppError(400, 'organization_id is required.', 'organization_id e obrigatorio.');
    }

    await this.authorizeOrganizationActionService.authorize(
      user_id,
      data.organization_id,
      PermissionDescriptionEnum.ORGANIZATION_ROLE_PERMISSION_READ,
    );

    const organizationRolePermissions = await this.organizationRolePermissionRepository.find(data);

    return {
      message: 'Organization role permissions retrieved successfully.',
      data: organizationRolePermissions,
    };
  }
}
export { FindOrganizationRolePermissionsService };
