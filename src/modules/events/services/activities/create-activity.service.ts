import CreateOrUpdateActivityDTO from '../../dtos/activity/create-or-update-activity.dto';
import IActivityRepositoryProvider from '../../infra/orm/repositories/providers/activity-repository.provider';
import { inject, injectable } from 'tsyringe';
import IUserOrganizationRepositoryProvider from '../../../users/infra/orm/repositories/providers/user-organization-repository.provider';
import UserOrganizationQueryOptions from '../../../users/dtos/user-organization/user-organization-query-options';
import AppError from '../../../../shared/infra/http/errors/app-error';

@injectable()
export class CreateActivityService {
  constructor(
    @inject('UserOrganizationRepositoryProvider')
    private userOrganizationRepositoryProvider: IUserOrganizationRepositoryProvider,
    @inject('ActivityRepositoryProvider')
    private activityRepositoryProvider: IActivityRepositoryProvider,
  ) {}

  public async execute(user_id: string, data: CreateOrUpdateActivityDTO) {
    const userOrganizationQuery = {
      user_id: user_id,
      organization_id: data.organization_id,
    } as UserOrganizationQueryOptions;

    const userOrganization = (await this.userOrganizationRepositoryProvider.find(userOrganizationQuery)).at(0);

    if (!userOrganization) {
      throw new AppError(403, 'User does not have permission to create event in this organization.');
    }

    data.organization = userOrganization.organization;

    const organizationActivity = await this.activityRepositoryProvider.create(data);

    const response = {
      message: 'Activity created successfully.',
      organizationActivity: {
        id: organizationActivity.id,
        name: organizationActivity.name,
        description: organizationActivity.description,
      },
    };

    return response;
  }
}
