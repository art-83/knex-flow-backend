import { inject, injectable } from 'tsyringe';
import ActivityQueryOptions from '../../dtos/activity/activity-query-options';
import IActivityRepositoryProvider from '../../infra/orm/repositories/providers/activity-repository.provider';
import { Activity } from '../../infra/orm/entities/activity.entity';

@injectable()
export class FindActivitiesService {
  constructor(
    @inject('ActivityRepositoryProvider')
    private activityRepository: IActivityRepositoryProvider,
  ) {}

  public async execute(options: Partial<ActivityQueryOptions>) {
    const activities = await this.activityRepository.find(options);
    const activitiesResponse = activities.map((activity: Partial<Activity>) => {
      delete activity.organization;
      return activity;
    });
    return { message: 'Activities found successfully.', data: activitiesResponse };
  }
}
