import { IPermissionRepositoryProvider } from '../providers/permission-repository.provider';
import { Permission } from '../../entities/permission.entity';
import { PermissionQueryOptions } from '../../../../dtos/permission/permission-query-options';
import { Repository } from 'typeorm';
import { dataSource } from '../../../../../../shared/infra/orm/database';

class PermissionRepository implements IPermissionRepositoryProvider {
  private repository: Repository<Permission>;

  constructor() {
    this.repository = dataSource.getRepository(Permission);
  }

  public async find(data: Partial<PermissionQueryOptions>): Promise<Permission[]> {
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
}
export { PermissionRepository };
