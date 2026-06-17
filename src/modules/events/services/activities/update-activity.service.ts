import { inject, injectable } from 'tsyringe';
import { CreateOrUpdateActivityDTO } from '../../dtos/activity/create-or-update-activity.dto';
import { IActivityRepositoryProvider } from '../../infra/orm/repositories/providers/activity-repository.provider';
import { AppError } from '../../../../shared/infra/http/errors/app-error';
import { IUserOrganizationRepositoryProvider } from '../../../users/infra/orm/repositories/providers/user-organization-repository.provider';
import { IPermissionRepositoryProvider } from '../../../users/infra/orm/repositories/providers/permission-repository.provider';
import { IUserPermissionRepositoryProvider } from '../../../users/infra/orm/repositories/providers/user-permission-repository.provider';
import { PermissionDescriptionEnum } from '../../../users/infra/orm/enums/permission-description.enum';

@injectable()
class UpdateActivityService {
  constructor(
    @inject('ActivityRepositoryProvider')
    private activityRepository: IActivityRepositoryProvider,
    @inject('UserOrganizationRepositoryProvider')
    private userOrganizationRepository: IUserOrganizationRepositoryProvider,
    @inject('PermissionRepositoryProvider')
    private permissionRepository: IPermissionRepositoryProvider,
    @inject('UserPermissionRepositoryProvider')
    private userPermissionRepository: IUserPermissionRepositoryProvider,
  ) {}

  public async execute(user_id: string, activity_id: string, data: Partial<CreateOrUpdateActivityDTO>) {
    const activityExists = (await this.activityRepository.find({ id: activity_id })).at(0);

    if (!activityExists) {
      throw new AppError(404, 'Activity not found.', 'Atividade nao encontrada.');
    }

    const userOrganization = (
      await this.userOrganizationRepository.find({ user_id, organization_id: activityExists.organization.id })
    ).at(0);

    if (!userOrganization) {
      throw new AppError(
        403,
        'You do not have access to this organization.',
        'Voce nao tem acesso a esta organizacao.',
      );
    }

    const requiredPermission = (
      await this.permissionRepository.find({ description: PermissionDescriptionEnum.ACTIVITIES_MANAGE })
    ).at(0);

    if (!requiredPermission) {
      throw new AppError(404, 'Permission not found.', 'Permissao nao encontrada.');
    }

    const permissionGrant = (
      await this.userPermissionRepository.find({
        user_id,
        organization_id: activityExists.organization.id,
        permission_id: requiredPermission.id,
      })
    ).at(0);

    if (!permissionGrant) {
      throw new AppError(
        403,
        'You do not have permission to perform this action.',
        'Voce nao tem permissao para realizar esta acao.',
      );
    }

    const activity = await this.activityRepository.update(activity_id, data);
    return { message: 'Activity updated successfully.', data: activity };
  }
}
export { UpdateActivityService };
