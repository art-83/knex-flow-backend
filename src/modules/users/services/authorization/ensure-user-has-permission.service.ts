import { inject, injectable } from 'tsyringe';
import IPermissionRepositoryProvider from '../../infra/orm/repositories/providers/permission-repository.provider';
import IUserPermissionRepositoryProvider from '../../infra/orm/repositories/providers/user-permission-repository.provider';
import AppError from '../../../../shared/infra/http/errors/app-error';

@injectable()
class EnsureUserHasPermissionService {
  constructor(
    @inject('PermissionRepositoryProvider')
    private permissionRepository: IPermissionRepositoryProvider,
    @inject('UserPermissionRepositoryProvider')
    private userPermissionRepository: IUserPermissionRepositoryProvider,
  ) {}

  public async execute(user_id: string, organization_id: string, permissionDescription: string): Promise<void> {
    const permission = (await this.permissionRepository.find({ description: permissionDescription })).find(
      item => item.description === permissionDescription,
    );

    if (!permission) {
      throw new AppError(
        403,
        'Required permission is not available in the catalog.',
        'Permissao necessaria nao esta disponivel no catalogo.',
      );
    }

    const userPermission = (
      await this.userPermissionRepository.find({
        user_id,
        organization_id,
        permission_id: permission.id,
      })
    ).at(0);

    if (!userPermission) {
      throw new AppError(403, 'User does not have required permission.', 'Usuario nao possui a permissao necessaria.');
    }
  }
}

export default EnsureUserHasPermissionService;
