import { inject, injectable } from 'tsyringe';
import CreateOrUpdateActivityDTO from '../../../events/dtos/activity/create-or-update-activity.dto';
import IUserOrganizationRepositoryProvider from '../../infra/orm/repositories/providers/user-organization-repository.provider';
import IActivityRepositoryProvider from '../../../events/infra/orm/repositories/providers/activity-repository.provider';
import UserOrganizationQueryOptions from '../../dtos/user-organization/user-organization-query-options';
import AppError from '../../../../shared/infra/http/errors/app-error';

@injectable()
export class CreateActivityService {
  constructor(
    @inject('UserOrganizationRepositoryProvider')
    private userOrganizationRepositoryProvider: IUserOrganizationRepositoryProvider,
    @inject('ActivityRepositoryProvider')
    private activityRepositoryProvider: IActivityRepositoryProvider,
  ) {}

  public async execute(user_id: string, organization_id: string, data: Partial<CreateOrUpdateActivityDTO>) {
    const userOrganizationQuery = {
      user_id,
      organization_id,
    } as UserOrganizationQueryOptions;

    const userOrganization = (await this.userOrganizationRepositoryProvider.find(userOrganizationQuery)).at(0);

    if (!userOrganization) {
      throw new AppError(403, 'User does not have permission to create event in this organization.');
    }

    data.organization = userOrganization.organization;

    const organizationActivity = await this.activityRepositoryProvider.create(data);

    return {
      message: 'Activity created successfully.',
      organizationActivity: {
        id: organizationActivity.id,
        name: organizationActivity.name,
        description: organizationActivity.description,
      },
    };
  }
}
