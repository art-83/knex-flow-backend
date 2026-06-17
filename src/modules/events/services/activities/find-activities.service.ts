import { inject, injectable } from 'tsyringe';
import { ActivityQueryOptions } from '../../dtos/activity/activity-query-options';
import { IActivityRepositoryProvider } from '../../infra/orm/repositories/providers/activity-repository.provider';
import { Activity } from '../../infra/orm/entities/activity.entity';
import { AppError } from '../../../../shared/infra/http/errors/app-error';
import { AuthorizeOrganizationActionService } from '../../../../shared/infra/http/authorization';
import { PermissionDescriptionEnum } from '../../../users/infra/orm/enums/permission-description.enum';

@injectable()
class FindActivitiesService {
  constructor(
    @inject('ActivityRepositoryProvider')
    private activityRepository: IActivityRepositoryProvider,
    private authorizeOrganizationActionService: AuthorizeOrganizationActionService,
  ) {}

  public async execute(user_id: string, options: Partial<ActivityQueryOptions>) {
    if (!options.organization_id) {
      throw new AppError(400, 'organization_id is required.', 'organization_id e obrigatorio.');
    }

    await this.authorizeOrganizationActionService.authorize(
      user_id,
      options.organization_id,
      PermissionDescriptionEnum.ACTIVITY_READ,
    );

    const activities = await this.activityRepository.find(options);
    const activitiesResponse = activities.map((activity: Partial<Activity>) => {
      delete activity.organization;
      return activity;
    });
    return { message: 'Activities found successfully.', data: activitiesResponse };
  }
}
export { FindActivitiesService };
