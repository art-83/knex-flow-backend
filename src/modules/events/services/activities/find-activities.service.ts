import { inject, injectable } from 'tsyringe';
import ActivityQueryOptions from '../../dtos/activity/activity-query-options';
import IActivityRepositoryProvider from '../../infra/orm/repositories/providers/activity-repository.provider';
import { Activity } from '../../infra/orm/entities/activity.entity';
import AppError from '../../../../shared/infra/http/errors/app-error';
import EnsureUserCanActOnOrganizationService from '../../../../shared/infra/http/authorization/ensure-user-can-act-on-organization.service';
import PermissionDescriptionEnum from '../../../users/enums/permission-description.enum';

@injectable()
export class FindActivitiesService {
  constructor(
    @inject('ActivityRepositoryProvider')
    private activityRepository: IActivityRepositoryProvider,
    private ensureUserCanActOnOrganizationService: EnsureUserCanActOnOrganizationService,
  ) {}

  public async execute(user_id: string, options: Partial<ActivityQueryOptions>) {
    if (!options.organization_id) {
      throw new AppError(400, 'organization_id is required.', 'organization_id e obrigatorio.');
    }

    await this.ensureUserCanActOnOrganizationService.execute(
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
