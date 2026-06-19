import { inject, injectable } from 'tsyringe';
import { IUserOrganizationRepositoryProvider } from '../../infra/orm/repositories/providers/user-organization-repository.provider';
import { IUserPermissionRepositoryProvider } from '../../infra/orm/repositories/providers/user-permission-repository.provider';
import { IPermissionRepositoryProvider } from '../../infra/orm/repositories/providers/permission-repository.provider';
import { AppError } from '../../../../shared/infra/http/errors/app-error';
import { PermissionDescriptionEnum } from '../../infra/orm/enums/permission-description.enum';
import { FindUsersOptionsDTO } from '../../dtos/incoming/http/user/find-users-options.dto';

@injectable()
class FindUsersService {
  constructor(
    @inject('UserOrganizationRepositoryProvider')
    private userOrganizationRepository: IUserOrganizationRepositoryProvider,
    @inject('UserPermissionRepositoryProvider')
    private userPermissionRepository: IUserPermissionRepositoryProvider,
    @inject('PermissionRepositoryProvider')
    private permissionRepository: IPermissionRepositoryProvider,
  ) {}

  public async execute(user_id: string, options: FindUsersOptionsDTO) {
    const userOrganization = (
      await this.userOrganizationRepository.find({ user_id, organization_id: options.organization_id })
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
        organization_id: options.organization_id,
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

    const memberships = await this.userOrganizationRepository.find({
      organization_id: options.organization_id,
    });

    const users = memberships
      .map(membership => membership.user)
      .filter(user => user !== undefined)
      .map(user => ({
        id: user.id,
        email: user.email,
      }));

    return {
      message: 'Users found successfully.',
      data: users,
    };
  }
}
export { FindUsersService };
