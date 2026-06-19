import { inject, injectable } from 'tsyringe';
import { IOrganizationRolePermissionRepositoryProvider } from '../../infra/orm/repositories/providers/organization-role-permission-repository.provider';
import { IOrganizationRoleRepositoryProvider } from '../../infra/orm/repositories/providers/organization-role-repository.provider';
import { IPermissionRepositoryProvider } from '../../infra/orm/repositories/providers/permission-repository.provider';
import { AppError } from '../../../../shared/infra/http/errors/app-error';
import { CreateOrUpdateOrganizationRolePermissionDTO } from '../../dtos/incoming/http/organization-role-permission/create-or-update-organization-role-permission.dto';
import { IUserOrganizationRepositoryProvider } from '../../infra/orm/repositories/providers/user-organization-repository.provider';
import { IUserPermissionRepositoryProvider } from '../../infra/orm/repositories/providers/user-permission-repository.provider';
import { PermissionDescriptionEnum } from '../../infra/orm/enums/permission-description.enum';

@injectable()
class CreateOrganizationRolePermissionService {
  constructor(
    @inject('OrganizationRolePermissionRepositoryProvider')
    private organizationRolePermissionRepository: IOrganizationRolePermissionRepositoryProvider,
    @inject('OrganizationRoleRepositoryProvider')
    private organizationRoleRepository: IOrganizationRoleRepositoryProvider,
    @inject('PermissionRepositoryProvider')
    private permissionRepository: IPermissionRepositoryProvider,
    @inject('UserOrganizationRepositoryProvider')
    private userOrganizationRepository: IUserOrganizationRepositoryProvider,
    @inject('UserPermissionRepositoryProvider')
    private userPermissionRepository: IUserPermissionRepositoryProvider,
  ) {}

  public async execute(user_id: string, organization_id: string, data: CreateOrUpdateOrganizationRolePermissionDTO) {
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

    const organizationRole = (
      await this.organizationRoleRepository.find({
        id: data.organization_role_id,
        organization_id,
      })
    ).at(0);

    if (!organizationRole) {
      throw new AppError(404, 'Organization role not found.', 'Papel da organizacao nao encontrado.');
    }

    const permission = (await this.permissionRepository.find({ id: data.permission_id })).at(0);

    if (!permission) {
      throw new AppError(404, 'Permission not found.', 'Permissao nao encontrada.');
    }

    const existingRelation = (
      await this.organizationRolePermissionRepository.find({
        organization_role_id: data.organization_role_id,
        permission_id: data.permission_id,
      })
    ).at(0);

    if (existingRelation) {
      throw new AppError(
        409,
        'Organization role permission relation already exists.',
        'Vinculo de permissao com papel da organizacao ja existe.',
      );
    }

    const organizationRolePermission = await this.organizationRolePermissionRepository.create({
      organization_role: organizationRole,
      permission,
    });

    return {
      message: 'Organization role permission created successfully.',
      data: organizationRolePermission,
    };
  }
}
export { CreateOrganizationRolePermissionService };
