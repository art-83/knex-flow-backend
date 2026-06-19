import { IUserPermissionRepositoryProvider } from '../providers/user-permission-repository.provider';
import { UserPermission } from '../../entities/user-permission.entity';
import { UserPermissionQueryOptionsDTO } from '../../../../dtos/incoming/http/user-permission/user-permission-query-options.dto';
import { Repository } from 'typeorm';
import { dataSource } from '../../../../../../shared/infra/orm/database';

class UserPermissionRepository implements IUserPermissionRepositoryProvider {
  private repository: Repository<UserPermission>;

  constructor() {
    this.repository = dataSource.getRepository(UserPermission);
  }

  public async find(data: Partial<UserPermissionQueryOptionsDTO>): Promise<UserPermission[]> {
    const query = this.repository.createQueryBuilder('userPermission');

    if (data.id) query.andWhere('userPermission.id = :id', { id: data.id });
    if (data.user_id) query.andWhere('userPermission.user_id = :user_id', { user_id: data.user_id });
    if (data.organization_id)
      query.andWhere('userPermission.organization_id = :organization_id', {
        organization_id: data.organization_id,
      });
    if (data.permission_id)
      query.andWhere('userPermission.permission_id = :permission_id', {
        permission_id: data.permission_id,
      });

    if (data.limit) query.limit(data.limit);
    if (data.offset) query.offset(data.offset);

    return await query.getMany();
  }

  public async create(data: UserPermission): Promise<UserPermission> {
    const entity = this.repository.create(data);
    return await this.repository.save(entity);
  }

  public async update(id: string, data: UserPermission): Promise<UserPermission> {
    const entity = this.repository.create({ ...data, id });
    return await this.repository.save(entity);
  }

  public async delete(id: string): Promise<number> {
    const deleteResult = await this.repository.softDelete(id);
    return Number(deleteResult.affected);
  }
}
export { UserPermissionRepository };
