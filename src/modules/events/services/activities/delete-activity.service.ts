import { inject, injectable } from 'tsyringe';
import IActivityRepositoryProvider from '../../infra/orm/repositories/providers/activity-repository.provider';
import AppError from '../../../../shared/infra/http/errors/app-error';
import EnsureUserCanActOnOrganizationService from '../../../../shared/infra/http/authorization/ensure-user-can-act-on-organization.service';
import PermissionDescriptionEnum from '../../../users/infra/orm/enums/permission-description.enum';

@injectable()
export class DeleteActivityService {
  constructor(
    @inject('ActivityRepositoryProvider')
    private activityRepository: IActivityRepositoryProvider,
    private ensureUserCanActOnOrganizationService: EnsureUserCanActOnOrganizationService,
  ) {}

  public async execute(user_id: string, activity_id: string) {
    const activity = (await this.activityRepository.find({ id: activity_id })).at(0);

    if (!activity) {
      throw new AppError(404, 'Activity not found.', 'Atividade nao encontrada.');
    }

    await this.ensureUserCanActOnOrganizationService.execute(
      user_id,
      activity.organization.id,
      PermissionDescriptionEnum.ACTIVITY_DELETE,
    );

    const rowsDeleted = await this.activityRepository.delete(activity_id);
    return { message: 'Activity deleted successfully.', deleted: rowsDeleted };
  }
}
