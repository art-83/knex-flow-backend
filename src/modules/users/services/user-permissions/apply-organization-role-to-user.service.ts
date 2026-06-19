import { inject, injectable } from 'tsyringe';
import { IUserPermissionRepositoryProvider } from '../../infra/orm/repositories/providers/user-permission-repository.provider';
import { IUserRepositoryProvider } from '../../infra/orm/repositories/providers/user-repository.provider';
import { IOrganizationRepositoryProvider } from '../../infra/orm/repositories/providers/organization-repository.provider';
import { IOrganizationRoleRepositoryProvider } from '../../infra/orm/repositories/providers/organization-role-repository.provider';
import { IOrganizationRolePermissionRepositoryProvider } from '../../infra/orm/repositories/providers/organization-role-permission-repository.provider';
import { AppError } from '../../../../shared/infra/http/errors/app-error';
import { ApplyOrganizationRoleRequestDTO } from '../../dtos/incoming/http/user-permission/apply-organization-role-request.dto';
import { IUserOrganizationRepositoryProvider } from '../../infra/orm/repositories/providers/user-organization-repository.provider';
import { IPermissionRepositoryProvider } from '../../infra/orm/repositories/providers/permission-repository.provider';
import { PermissionDescriptionEnum } from '../../infra/orm/enums/permission-description.enum';

/**
 * Applies an organization role (a saved permission policy template) to a user
 * by materializing the role's permissions into `user_permissions`. This is a
 * one-time snapshot: later edits to the role do NOT propagate. Existing grants
 * are kept (additive), so the operation is idempotent.
 */
@injectable()
class ApplyOrganizationRoleToUserService {
  constructor(
    @inject('UserPermissionRepositoryProvider')
    private userPermissionRepository: IUserPermissionRepositoryProvider,
    @inject('UserRepositoryProvider')
    private userRepository: IUserRepositoryProvider,
    @inject('OrganizationRepositoryProvider')
    private organizationRepository: IOrganizationRepositoryProvider,
    @inject('OrganizationRoleRepositoryProvider')
    private organizationRoleRepository: IOrganizationRoleRepositoryProvider,
    @inject('OrganizationRolePermissionRepositoryProvider')
    private organizationRolePermissionRepository: IOrganizationRolePermissionRepositoryProvider,
    @inject('UserOrganizationRepositoryProvider')
    private userOrganizationRepository: IUserOrganizationRepositoryProvider,
    @inject('PermissionRepositoryProvider')
    private permissionRepository: IPermissionRepositoryProvider,
  ) {}

  public async execute(actor_user_id: string, data: ApplyOrganizationRoleRequestDTO) {
    const userOrganization = (
      await this.userOrganizationRepository.find({ user_id: actor_user_id, organization_id: data.organization_id })
    ).at(0);

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
        user_id: actor_user_id,
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

    const user = (await this.userRepository.find({ id: data.user_id })).at(0);

    if (!user) {
      throw new AppError(404, 'User not found.', 'Usuario nao encontrado.');
    }

    const organization = (await this.organizationRepository.find({ id: data.organization_id })).at(0);

    if (!organization) {
      throw new AppError(404, 'Organization not found.', 'Organizacao nao encontrada.');
    }

    const targetUserOrganization = (
      await this.userOrganizationRepository.find({ user_id: data.user_id, organization_id: data.organization_id })
    ).at(0);

    if (!targetUserOrganization) {
      throw new AppError(
        400,
        'Target user does not belong to this organization.',
        'Usuario alvo nao pertence a esta organizacao.',
      );
    }

    const organizationRole = (
      await this.organizationRoleRepository.find({
        id: data.organization_role_id,
        organization_id: data.organization_id,
      })
    ).at(0);

    if (!organizationRole) {
      throw new AppError(404, 'Organization role not found.', 'Papel da organizacao nao encontrado.');
    }

    const rolePermissions = await this.organizationRolePermissionRepository.find({
      organization_role_id: data.organization_role_id,
      organization_id: data.organization_id,
    });

    let applied = 0;
    let skipped = 0;

    for (const rolePermission of rolePermissions) {
      const permission = rolePermission.permission;

      const existingGrant = (
        await this.userPermissionRepository.find({
          user_id: data.user_id,
          organization_id: data.organization_id,
          permission_id: permission.id,
        })
      ).at(0);

      if (existingGrant) {
        skipped += 1;
        continue;
      }

      await this.userPermissionRepository.create({
        user,
        organization,
        permission,
      });

      applied += 1;
    }

    return {
      message: 'Organization role applied to user successfully.',
      data: {
        organization_role_id: data.organization_role_id,
        user_id: data.user_id,
        applied,
        skipped,
        total: rolePermissions.length,
      },
    };
  }
}
export { ApplyOrganizationRoleToUserService };
