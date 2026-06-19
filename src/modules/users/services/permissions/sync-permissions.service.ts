import { inject, injectable } from 'tsyringe';
import { IPermissionRepositoryProvider } from '../../infra/orm/repositories/providers/permission-repository.provider';
import { PermissionDescriptionEnum } from '../../infra/orm/enums/permission-description.enum';

@injectable()
class SyncPermissionsService {
  constructor(
    @inject('PermissionRepositoryProvider')
    private permissionRepository: IPermissionRepositoryProvider,
  ) {}

  public async execute(): Promise<void> {
    const enumDescriptions = Object.values(PermissionDescriptionEnum) as string[];
    await this.permissionRepository.syncFromEnum(enumDescriptions);
  }
}
export { SyncPermissionsService };
