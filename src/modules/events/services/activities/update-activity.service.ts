import { inject, injectable } from 'tsyringe';
import CreateOrUpdateActivityDTO from '../../dtos/activity/create-or-update-activity.dto';
import IActivityRepositoryProvider from '../../infra/orm/repositories/providers/activity-repository.provider';

@injectable()
export class UpdateActivityService {
  constructor(
    @inject('ActivityRepositoryProvider')
    private activityRepository: IActivityRepositoryProvider,
  ) {}

  public async execute(activity_id: string, data: Partial<CreateOrUpdateActivityDTO>) {
    const activity = await this.activityRepository.update(activity_id, data);
    return { message: 'Activity updated successfully.', data: activity };
  }
}
