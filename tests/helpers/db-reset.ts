import { container } from 'tsyringe';

import { dataSource } from '../../src/shared/infra/orm/database';
import { SyncPermissionsService } from '../../src/modules/users/services/permissions/sync-permissions.service';

async function resetDatabase(): Promise<void> {
  if (!dataSource.isInitialized) {
    return;
  }

  const tableNames = dataSource.entityMetadatas
    .map(metadata => `"${metadata.schema ?? 'public'}"."${metadata.tableName}"`)
    .join(', ');

  if (tableNames.length > 0) {
    await dataSource.query(`TRUNCATE ${tableNames} RESTART IDENTITY CASCADE`);
  }

  const syncPermissionsService = container.resolve(SyncPermissionsService);
  await syncPermissionsService.execute();
}

export { resetDatabase };
