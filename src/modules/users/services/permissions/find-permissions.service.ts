import { inject, injectable } from 'tsyringe';

import { IPermissionRepositoryProvider } from '../../infra/orm/repositories/providers/permission-repository.provider';

@injectable()
class FindPermissionsService {
  constructor(
    @inject('PermissionRepositoryProvider')
    private permissionRepository: IPermissionRepositoryProvider,
  ) {}

  public async execute() {
    const permissions = await this.permissionRepository.find({});

    return {
      message: 'Permissions retrieved successfully.',
      data: permissions.map(permission => ({
        id: permission.id,
        description: permission.description,
      })),
    };
  }
}
export { FindPermissionsService };
