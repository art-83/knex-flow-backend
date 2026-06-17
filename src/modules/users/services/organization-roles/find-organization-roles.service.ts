import { inject, injectable } from 'tsyringe';
import { IOrganizationRoleRepositoryProvider } from '../../infra/orm/repositories/providers/organization-role-repository.provider';
import { AppError } from '../../../../shared/infra/http/errors/app-error';
import { OrganizationRoleQueryOptions } from '../../dtos/organization-role/organization-role-query-options';
import { IUserOrganizationRepositoryProvider } from '../../infra/orm/repositories/providers/user-organization-repository.provider';
import { IPermissionRepositoryProvider } from '../../infra/orm/repositories/providers/permission-repository.provider';
import { IUserPermissionRepositoryProvider } from '../../infra/orm/repositories/providers/user-permission-repository.provider';
import { PermissionDescriptionEnum } from '../../infra/orm/enums/permission-description.enum';

@injectable()
class FindOrganizationRolesService {
  constructor(
    @inject('OrganizationRoleRepositoryProvider')
    private organizationRoleRepository: IOrganizationRoleRepositoryProvider,
    @inject('UserOrganizationRepositoryProvider')
    private userOrganizationRepository: IUserOrganizationRepositoryProvider,
    @inject('PermissionRepositoryProvider')
    private permissionRepository: IPermissionRepositoryProvider,
    @inject('UserPermissionRepositoryProvider')
    private userPermissionRepository: IUserPermissionRepositoryProvider,
  ) {}

  public async execute(user_id: string, data: Partial<OrganizationRoleQueryOptions>) {
    if (!data.organization_id) {
      throw new AppError(400, 'organization_id is required.', 'organization_id e obrigatorio.');
    }

    const userOrganization = (
      await this.userOrganizationRepository.find({ user_id, organization_id: data.organization_id })
    ).at(0);

    if (!userOrganization) {
      throw new AppError(
        403,
        'You do not have access to this organization.',
        'Voce nao tem acesso a esta organizacao.',
      );
    }

    const requiredPermission = (
      await this.permissionRepository.find({ description: PermissionDescriptionEnum.TEAM_READ })
    ).at(0);

    if (!requiredPermission) {
      throw new AppError(404, 'Permission not found.', 'Permissao nao encontrada.');
    }

    const permissionGrant = (
      await this.userPermissionRepository.find({
        user_id,
        organization_id: data.organization_id,
        permission_id: requiredPermission.id,
      })
    ).at(0);

    if (!permissionGrant) {
      throw new AppError(
        403,
        'You do not have permission to perform this action.',
        'Voce nao tem permissao para realizar esta acao.',
      );
    }

    const organizationRoles = await this.organizationRoleRepository.find(data);

    return {
      message: 'Organization roles retrieved successfully.',
      data: organizationRoles,
    };
  }
}
export { FindOrganizationRolesService };
