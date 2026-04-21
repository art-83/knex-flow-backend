import IActivityRepositoryProvider from '../providers/activity-repository.provider';
import Activity from '../../entities/activity.entity';
import ActivityQueryOptions from '../../../../dtos/activity/activity-query-options';
import { Repository } from 'typeorm';
import dataSource from '../../../../../../shared/infra/orm/database';

class ActivityRepository implements IActivityRepositoryProvider {
  private repository: Repository<Activity>;

  constructor() {
    this.repository = dataSource.getRepository(Activity);
  }

  public async find(data: Partial<ActivityQueryOptions>): Promise<Activity[]> {
    const query = this.repository.createQueryBuilder('activity');

    if (data.id) query.andWhere('activity.id = :id', { id: data.id });

    if (data.organization_id)
      query.andWhere('activity.organization_id = :organization_id', { organization_id: data.organization_id });

    if (data.name) query.andWhere('activity.name = :name', { name: data.name });

    if (data.limit) query.limit(data.limit);
    if (data.offset) query.offset(data.offset);

    return await query.getMany();
  }

  public async create(data: Activity): Promise<Activity> {
    const create = this.repository.create(data);
    return await this.repository.save(create);
  }

  public async update(id: string, data: Activity): Promise<Activity> {
    const create = this.repository.create(data);
    await this.repository.update(id, create);
    return create;
  }

  public async delete(id: string): Promise<number> {
    const deleteResult = await this.repository.softDelete(id);
    return Number(deleteResult.affected);
  }
}

export default ActivityRepository;
