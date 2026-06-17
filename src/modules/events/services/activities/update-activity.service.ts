import { inject, injectable } from 'tsyringe';
import { CreateOrUpdateActivityDTO } from '../../dtos/activity/create-or-update-activity.dto';
import { IActivityRepositoryProvider } from '../../infra/orm/repositories/providers/activity-repository.provider';
import { AppError } from '../../../../shared/infra/http/errors/app-error';
import { AuthorizeOrganizationActionService } from '../../../../shared/infra/http/authorization';
import { PermissionDescriptionEnum } from '../../../users/infra/orm/enums/permission-description.enum';

@injectable()
class UpdateActivityService {
  constructor(
    @inject('ActivityRepositoryProvider')
    private activityRepository: IActivityRepositoryProvider,
    private authorizeOrganizationActionService: AuthorizeOrganizationActionService,
  ) {}

  public async execute(user_id: string, activity_id: string, data: Partial<CreateOrUpdateActivityDTO>) {
    const activityExists = (await this.activityRepository.find({ id: activity_id })).at(0);

    if (!activityExists) {
      throw new AppError(404, 'Activity not found.', 'Atividade nao encontrada.');
    }

    await this.authorizeOrganizationActionService.authorize(
      user_id,
      activityExists.organization.id,
      PermissionDescriptionEnum.ACTIVITY_UPDATE,
    );

    const activity = await this.activityRepository.update(activity_id, data);
    return { message: 'Activity updated successfully.', data: activity };
  }
}
export { UpdateActivityService };
