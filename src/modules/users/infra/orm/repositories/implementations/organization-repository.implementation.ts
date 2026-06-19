import { IOrganizationRepositoryProvider } from '../providers/organization-repository.provider';
import { Organization } from '../../entities/organization.entity';
import { OrganizationQueryOptionsDTO } from '../../../../dtos/incoming/http/organization/organization-query-options.dto';
import { Repository } from 'typeorm';
import { dataSource } from '../../../../../../shared/infra/orm/database';

class OrganizationRepository implements IOrganizationRepositoryProvider {
  private repository: Repository<Organization>;

  constructor() {
    this.repository = dataSource.getRepository(Organization);
  }

  public async find(data: Partial<OrganizationQueryOptionsDTO>): Promise<Organization[]> {
    const query = this.repository.createQueryBuilder('organization');

    if (data.id) query.andWhere('organization.id = :id', { id: data.id });
    if (data.name) query.andWhere('organization.name ILIKE :name', { name: `%${data.name}%` });

    if (data.limit) query.limit(data.limit);
    if (data.offset) query.offset(data.offset);

    return await query.getMany();
  }

  public async create(data: Organization): Promise<Organization> {
    const entity = this.repository.create(data);
    return await this.repository.save(entity);
  }

  public async update(id: string, data: Organization): Promise<Organization> {
    const entity = this.repository.create({ ...data, id });
    return await this.repository.save(entity);
  }

  public async delete(id: string): Promise<number> {
    const deleteResult = await this.repository.softDelete(id);
    return Number(deleteResult.affected);
  }
}
export { OrganizationRepository };
