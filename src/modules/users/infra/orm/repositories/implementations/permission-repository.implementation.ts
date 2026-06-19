import { IPermissionRepositoryProvider } from '../providers/permission-repository.provider';
import { Permission } from '../../entities/permission.entity';
import { PermissionQueryOptionsDTO } from '../../../../dtos/incoming/http/permission/permission-query-options.dto';
import { Repository } from 'typeorm';
import { dataSource } from '../../../../../../shared/infra/orm/database';

class PermissionRepository implements IPermissionRepositoryProvider {
  private repository: Repository<Permission>;

  constructor() {
    this.repository = dataSource.getRepository(Permission);
  }

  public async find(data: Partial<PermissionQueryOptionsDTO>): Promise<Permission[]> {
    const query = this.repository.createQueryBuilder('permission');

    if (data.id) query.andWhere('permission.id = :id', { id: data.id });
    if (data.description)
      query.andWhere('permission.description = :description', {
        description: data.description,
      });

    if (data.limit) query.limit(data.limit);
    if (data.offset) query.offset(data.offset);

    return await query.getMany();
  }

  public async create(data: Permission): Promise<Permission> {
    const entity = this.repository.create(data);
    return await this.repository.save(entity);
  }

  public async update(id: string, data: Permission): Promise<Permission> {
    const entity = this.repository.create({ ...data, id });
    return await this.repository.save(entity);
  }

  public async delete(id: string): Promise<number> {
    const deleteResult = await this.repository.softDelete(id);
    return Number(deleteResult.affected);
  }

  public async syncFromEnum(descriptions: string[]): Promise<void> {
    const existingPermissions = await this.repository.find({ withDeleted: true });

    for (const description of descriptions) {
      const existingPermission = existingPermissions.find(item => item.description === description);

      if (!existingPermission) {
        await this.repository.save(this.repository.create({ description }));
        continue;
      }

      if (existingPermission.deleted_at) {
        existingPermission.deleted_at = null as unknown as Date;
        await this.repository.save(existingPermission);
      }
    }

    for (const existingPermission of existingPermissions) {
      if (descriptions.includes(existingPermission.description) || existingPermission.deleted_at) {
        continue;
      }

      existingPermission.deleted_at = new Date();
      await this.repository.save(existingPermission);
    }
  }
}
export { PermissionRepository };
