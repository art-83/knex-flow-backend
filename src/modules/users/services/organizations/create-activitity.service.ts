import { inject, injectable } from 'tsyringe';
import { CreateOrUpdateActivityDTO } from '../../../events/dtos/activity/create-or-update-activity.dto';
import { IOrganizationRepositoryProvider } from '../../infra/orm/repositories/providers/organization-repository.provider';
import { IActivityRepositoryProvider } from '../../../events/infra/orm/repositories/providers/activity-repository.provider';
import { AppError } from '../../../../shared/infra/http/errors/app-error';
import { AuthorizeOrganizationActionService } from '../../../../shared/infra/http/authorization';
import { PermissionDescriptionEnum } from '../../infra/orm/enums/permission-description.enum';

@injectable()
class CreateActivityService {
  constructor(
    @inject('OrganizationRepositoryProvider')
    private organizationRepository: IOrganizationRepositoryProvider,
    @inject('ActivityRepositoryProvider')
    private activityRepositoryProvider: IActivityRepositoryProvider,
    private authorizeOrganizationActionService: AuthorizeOrganizationActionService,
  ) {}

  public async execute(user_id: string, organization_id: string, data: Partial<CreateOrUpdateActivityDTO>) {
    await this.authorizeOrganizationActionService.authorize(
      user_id,
      organization_id,
      PermissionDescriptionEnum.ACTIVITY_CREATE,
    );

    const organization = (await this.organizationRepository.find({ id: organization_id })).at(0);

    if (!organization) {
      throw new AppError(404, 'Organization not found.', 'Organizacao nao encontrada.');
    }

    data.organization = organization;

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
export { CreateActivityService };
