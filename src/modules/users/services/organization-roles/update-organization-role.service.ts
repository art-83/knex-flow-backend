import { inject, injectable } from 'tsyringe';
import { IOrganizationRoleRepositoryProvider } from '../../infra/orm/repositories/providers/organization-role-repository.provider';
import { AppError } from '../../../../shared/infra/http/errors/app-error';
import { CreateOrUpdateOrganizationRoleDTO } from '../../dtos/organization-role/create-or-update-organization-role.dto';
import { IUserOrganizationRepositoryProvider } from '../../infra/orm/repositories/providers/user-organization-repository.provider';
import { IPermissionRepositoryProvider } from '../../infra/orm/repositories/providers/permission-repository.provider';
import { IUserPermissionRepositoryProvider } from '../../infra/orm/repositories/providers/user-permission-repository.provider';
import { PermissionDescriptionEnum } from '../../infra/orm/enums/permission-description.enum';

@injectable()
class UpdateOrganizationRoleService {
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

  public async execute(
    user_id: string,
    id: string,
    organization_id: string,
    data: Partial<CreateOrUpdateOrganizationRoleDTO>,
  ) {
    const userOrganization = (await this.userOrganizationRepository.find({ user_id, organization_id })).at(0);

    if (!userOrganization) {
      throw new AppError(
        403,
        'You do not have access to this organization.',
        'Voce nao tem acesso a esta organizacao.',
      );
    }

    const requiredPermission = (
      await this.permissionRepository.find({ description: PermissionDescriptionEnum.TEAM_MANAGE })
    ).at(0);

    if (!requiredPermission) {
      throw new AppError(404, 'Permission not found.', 'Permissao nao encontrada.');
    }

    const permissionGrant = (
      await this.userPermissionRepository.find({
        user_id,
        organization_id,
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

    const existingRole = (await this.organizationRoleRepository.find({ id, organization_id })).at(0);

    if (!existingRole) {
      throw new AppError(404, 'Organization role not found.', 'Papel da organizacao nao encontrado.');
    }

    if (data.name !== undefined) {
      const name = data.name;
      const conflictingRole = (
        await this.organizationRoleRepository.find({
          organization_id,
          name,
        })
      ).find(item => item.id !== id && item.name.trim().toLowerCase() === name.trim().toLowerCase());

      if (conflictingRole) {
        throw new AppError(409, 'Organization role already exists.', 'Papel da organizacao ja existe.');
      }
    }

    const organizationRole = await this.organizationRoleRepository.update(id, data);

    return {
      message: 'Organization role updated successfully.',
      data: organizationRole,
    };
  }
}
export { UpdateOrganizationRoleService };
