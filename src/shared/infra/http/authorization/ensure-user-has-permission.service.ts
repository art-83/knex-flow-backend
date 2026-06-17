import { inject, injectable } from 'tsyringe';
import IPermissionRepositoryProvider from '../../../../modules/users/infra/orm/repositories/providers/permission-repository.provider';
import IUserPermissionRepositoryProvider from '../../../../modules/users/infra/orm/repositories/providers/user-permission-repository.provider';
import AppError from '../errors/app-error';
import PermissionDescriptionEnum from '../../../../modules/users/infra/orm/enums/permission-description.enum';

@injectable()
class EnsureUserHasPermissionService {
  constructor(
    @inject('PermissionRepositoryProvider')
    private permissionRepository: IPermissionRepositoryProvider,
    @inject('UserPermissionRepositoryProvider')
    private userPermissionRepository: IUserPermissionRepositoryProvider,
  ) {}

  public async execute(
    user_id: string,
    organization_id: string,
    permissionDescription: PermissionDescriptionEnum,
  ): Promise<void> {
    const permission = (await this.permissionRepository.find({ description: permissionDescription })).at(0);

    if (!permission) {
      throw new AppError(404, 'Permission not found.', 'Permissao nao encontrada.');
    }

    const grant = (
      await this.userPermissionRepository.find({
        user_id,
        organization_id,
        permission_id: permission.id,
      })
    ).at(0);

    if (!grant) {
      throw new AppError(
        403,
        'You do not have permission to perform this action.',
        'Voce nao tem permissao para realizar esta acao.',
      );
    }
  }
}

export default EnsureUserHasPermissionService;
