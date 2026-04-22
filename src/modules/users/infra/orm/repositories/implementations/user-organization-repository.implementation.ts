import IUserOrganizationRepositoryProvider from '../providers/user-organization-repository.provider';
import { UserOrganization } from '../../entities/user-organization.entity';
import UserOrganizationQueryOptions from '../../../../dtos/user-organization/user-organization-query-options';
import { Repository } from 'typeorm';
import dataSource from '../../../../../../shared/infra/orm/database';

class UserOrganizationRepository implements IUserOrganizationRepositoryProvider {
  private repository: Repository<UserOrganization>;

  constructor() {
    this.repository = dataSource.getRepository(UserOrganization);
  }

  public async find(data: Partial<UserOrganizationQueryOptions>): Promise<UserOrganization[]> {
    const query = this.repository.createQueryBuilder('userOrganization');

    query.leftJoinAndSelect('userOrganization.organization', 'organization');

    if (data.id) query.andWhere('userOrganization.id = :id', { id: data.id });
    if (data.user_id) query.andWhere('userOrganization.user_id = :user_id', { user_id: data.user_id });
    if (data.organization_id)
      query.andWhere('userOrganization.organization_id = :organization_id', {
        organization_id: data.organization_id,
      });

    if (data.limit) query.limit(data.limit);
    if (data.offset) query.offset(data.offset);

    return await query.getMany();
  }

  public async create(data: UserOrganization): Promise<UserOrganization> {
    const entity = this.repository.create(data);
    return await this.repository.save(entity);
  }

  public async update(id: string, data: UserOrganization): Promise<UserOrganization> {
    const entity = this.repository.create({ ...data, id });
    return await this.repository.save(entity);
  }

  public async delete(id: string): Promise<number> {
    const deleteResult = await this.repository.softDelete(id);
    return Number(deleteResult.affected);
  }
}

export default UserOrganizationRepository;
