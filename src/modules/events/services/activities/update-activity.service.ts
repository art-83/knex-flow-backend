import { inject, injectable } from 'tsyringe';
import CreateOrUpdateActivityDTO from '../../dtos/activity/create-or-update-activity.dto';
import IActivityRepositoryProvider from '../../infra/orm/repositories/providers/activity-repository.provider';
import AppError from '../../../../shared/infra/http/errors/app-error';
import EnsureUserCanActOnOrganizationService from '../../../../shared/infra/http/authorization/ensure-user-can-act-on-organization.service';
import PermissionDescriptionEnum from '../../../users/infra/orm/enums/permission-description.enum';

@injectable()
export class UpdateActivityService {
  constructor(
    @inject('ActivityRepositoryProvider')
    private activityRepository: IActivityRepositoryProvider,
    private ensureUserCanActOnOrganizationService: EnsureUserCanActOnOrganizationService,
  ) {}

  public async execute(user_id: string, activity_id: string, data: Partial<CreateOrUpdateActivityDTO>) {
    const activityExists = (await this.activityRepository.find({ id: activity_id })).at(0);

    if (!activityExists) {
      throw new AppError(404, 'Activity not found.', 'Atividade nao encontrada.');
    }

    await this.ensureUserCanActOnOrganizationService.execute(
      user_id,
      activityExists.organization.id,
      PermissionDescriptionEnum.ACTIVITY_UPDATE,
    );

    const activity = await this.activityRepository.update(activity_id, data);
    return { message: 'Activity updated successfully.', data: activity };
  }
}
