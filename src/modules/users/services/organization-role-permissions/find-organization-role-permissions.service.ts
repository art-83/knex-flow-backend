import { inject, injectable } from 'tsyringe';
import IOrganizationRolePermissionRepositoryProvider from '../../infra/orm/repositories/providers/organization-role-permission-repository.provider';
import AppError from '../../../../shared/infra/http/errors/app-error';
import OrganizationRolePermissionQueryOptions from '../../dtos/organization-role-permission/organization-role-permission-query-options';

@injectable()
class FindOrganizationRolePermissionsService {
  constructor(
    @inject('OrganizationRolePermissionRepositoryProvider')
    private organizationRolePermissionRepository: IOrganizationRolePermissionRepositoryProvider,
  ) {}

  public async execute(user_id: string, data: Partial<OrganizationRolePermissionQueryOptions>) {
    if (!data.organization_id) {
      throw new AppError(400, 'organization_id is required.', 'organization_id e obrigatorio.');
    }

    const organizationRolePermissions = await this.organizationRolePermissionRepository.find(data);

    return {
      message: 'Organization role permissions retrieved successfully.',
      data: organizationRolePermissions,
    };
  }
}

export default FindOrganizationRolePermissionsService;
