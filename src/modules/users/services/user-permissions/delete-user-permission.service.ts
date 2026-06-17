import { inject, injectable } from 'tsyringe';
import { IUserPermissionRepositoryProvider } from '../../infra/orm/repositories/providers/user-permission-repository.provider';
import { AppError } from '../../../../shared/infra/http/errors/app-error';
import { IUserOrganizationRepositoryProvider } from '../../infra/orm/repositories/providers/user-organization-repository.provider';
import { IPermissionRepositoryProvider } from '../../infra/orm/repositories/providers/permission-repository.provider';
import { PermissionDescriptionEnum } from '../../infra/orm/enums/permission-description.enum';

@injectable()
class DeleteUserPermissionService {
  constructor(
    @inject('UserPermissionRepositoryProvider')
    private userPermissionRepository: IUserPermissionRepositoryProvider,
    @inject('UserOrganizationRepositoryProvider')
    private userOrganizationRepository: IUserOrganizationRepositoryProvider,
    @inject('PermissionRepositoryProvider')
    private permissionRepository: IPermissionRepositoryProvider,
  ) {}

  public async execute(user_id: string, id: string, organization_id: string) {
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

    const existingRelation = (
      await this.userPermissionRepository.find({
        id,
        organization_id,
      })
    ).at(0);

    if (!existingRelation) {
      throw new AppError(404, 'User permission not found.', 'Permissao do usuario nao encontrada.');
    }

    await this.userPermissionRepository.delete(id);

    return {
      message: 'User permission deleted successfully.',
    };
  }
}
export { DeleteUserPermissionService };
