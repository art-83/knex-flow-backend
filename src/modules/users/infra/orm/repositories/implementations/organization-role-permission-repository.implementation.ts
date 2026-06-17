import { IOrganizationRolePermissionRepositoryProvider } from '../providers/organization-role-permission-repository.provider';
import { OrganizationRolePermission } from '../../entities/organization-role-permission.entity';
import { OrganizationRolePermissionQueryOptions } from '../../../../dtos/organization-role-permission/organization-role-permission-query-options';
import { Repository } from 'typeorm';
import { dataSource } from '../../../../../../shared/infra/orm/database';

class OrganizationRolePermissionRepository implements IOrganizationRolePermissionRepositoryProvider {
  private repository: Repository<OrganizationRolePermission>;

  constructor() {
    this.repository = dataSource.getRepository(OrganizationRolePermission);
  }

  public async find(data: Partial<OrganizationRolePermissionQueryOptions>): Promise<OrganizationRolePermission[]> {
    const query = this.repository.createQueryBuilder('orgRolePerm');

    query
      .leftJoinAndSelect('orgRolePerm.organizationRole', 'organizationRole')
      .leftJoinAndSelect('orgRolePerm.permission', 'permission')
      .leftJoinAndSelect('organizationRole.organization', 'organization');

    if (data.id) query.andWhere('orgRolePerm.id = :id', { id: data.id });
    if (data.organization_id)
      query.andWhere('organization.id = :organization_id', {
        organization_id: data.organization_id,
      });
    if (data.organization_role_id)
      query.andWhere('orgRolePerm.organization_role_id = :organization_role_id', {
        organization_role_id: data.organization_role_id,
      });
    if (data.permission_id)
      query.andWhere('orgRolePerm.permission_id = :permission_id', {
        permission_id: data.permission_id,
      });

    if (data.limit) query.limit(data.limit);
    if (data.offset) query.offset(data.offset);

    return await query.getMany();
  }

  public async create(data: OrganizationRolePermission): Promise<OrganizationRolePermission> {
    const entity = this.repository.create(data);
    return await this.repository.save(entity);
  }

  public async update(id: string, data: OrganizationRolePermission): Promise<OrganizationRolePermission> {
    const entity = this.repository.create({ ...data, id });
    return await this.repository.save(entity);
  }

  public async delete(id: string): Promise<number> {
    const deleteResult = await this.repository.softDelete(id);
    return Number(deleteResult.affected);
  }
}
export { OrganizationRolePermissionRepository };
