import { IOrganizationRoleRepositoryProvider } from '../providers/organization-role-repository.provider';
import { OrganizationRole } from '../../entities/organization-role.entity';
import { OrganizationRoleQueryOptions } from '../../../../dtos/organization-role/organization-role-query-options';
import { Repository } from 'typeorm';
import { dataSource } from '../../../../../../shared/infra/orm/database';

class OrganizationRoleRepository implements IOrganizationRoleRepositoryProvider {
  private repository: Repository<OrganizationRole>;

  constructor() {
    this.repository = dataSource.getRepository(OrganizationRole);
  }

  public async find(data: Partial<OrganizationRoleQueryOptions>): Promise<OrganizationRole[]> {
    const query = this.repository.createQueryBuilder('organizationRole');

    if (data.id) query.andWhere('organizationRole.id = :id', { id: data.id });
    if (data.name) query.andWhere('organizationRole.name ILIKE :name', { name: `%${data.name}%` });
    if (data.organization_id)
      query.andWhere('organizationRole.organization_id = :organization_id', {
        organization_id: data.organization_id,
      });

    if (data.limit) query.limit(data.limit);
    if (data.offset) query.offset(data.offset);

    return await query.getMany();
  }

  public async create(data: OrganizationRole): Promise<OrganizationRole> {
    const entity = this.repository.create(data);
    return await this.repository.save(entity);
  }

  public async update(id: string, data: Partial<OrganizationRole>): Promise<OrganizationRole> {
    const update = this.repository.create(data);
    await this.repository.update(id, update);
    return update;
  }

  public async delete(id: string): Promise<number> {
    const deleteResult = await this.repository.softDelete(id);
    return Number(deleteResult.affected);
  }
}
export { OrganizationRoleRepository };
