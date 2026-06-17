import { dataSource } from '../../../../shared/infra/orm/database';
import { Permission } from '../../infra/orm/entities/permission.entity';
import { PermissionDescriptionEnum } from '../../infra/orm/enums/permission-description.enum';

class SyncPermissionsService {
  public async execute(): Promise<void> {
    const repository = dataSource.getRepository(Permission);

    const enumDescriptions = Object.values(PermissionDescriptionEnum) as string[];
    const existingPermissions = await repository.find({ withDeleted: true });

    for (const description of enumDescriptions) {
      const existingPermission = existingPermissions.find(item => item.description === description);

      if (!existingPermission) {
        await repository.save(repository.create({ description }));
        continue;
      }

      if (existingPermission.deleted_at) {
        existingPermission.deleted_at = null as unknown as Date;
        await repository.save(existingPermission);
      }
    }

    for (const existingPermission of existingPermissions) {
      if (enumDescriptions.includes(existingPermission.description) || existingPermission.deleted_at) {
        continue;
      }

      existingPermission.deleted_at = new Date();
      await repository.save(existingPermission);
    }
  }
}
export { SyncPermissionsService };
