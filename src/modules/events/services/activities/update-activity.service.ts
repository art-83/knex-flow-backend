import { inject, injectable } from 'tsyringe';
import CreateOrUpdateActivityDTO from '../../dtos/activity/create-or-update-activity.dto';
import IActivityRepositoryProvider from '../../infra/orm/repositories/providers/activity-repository.provider';
import IUserOrganizationRepositoryProvider from '../../../users/infra/orm/repositories/providers/user-organization-repository.provider';
import UserOrganizationQueryOptions from '../../../users/dtos/user-organization/user-organization-query-options';
import AppError from '../../../../shared/infra/http/errors/app-error';

@injectable()
export class UpdateActivityService {
  constructor(
    @inject('ActivityRepositoryProvider')
    private activityRepository: IActivityRepositoryProvider,
    @inject('UserOrganizationRepositoryProvider')
    private userOrganizationRepository: IUserOrganizationRepositoryProvider,
  ) {}

  public async execute(user_id: string, activity_id: string, data: Partial<CreateOrUpdateActivityDTO>) {
    const activityExists = (await this.activityRepository.find({ id: activity_id })).at(0);

    if (!activityExists) {
      throw new AppError(404, 'Activity not found.', 'Atividade nao encontrada.');
    }

    const userPermissionQueryOptions = {
      user_id,
      organization_id: activityExists.organization.id,
    } as UserOrganizationQueryOptions;

    const userOrganization = (await this.userOrganizationRepository.find(userPermissionQueryOptions)).at(0);

    if (!userOrganization) {
      throw new AppError(
        403,
        'User does not have permission to update activity in this organization.',
        'Usuario nao tem permissao para atualizar atividade nesta organizacao.',
      );
    }

    const activity = await this.activityRepository.update(activity_id, data);
    return { message: 'Activity updated successfully.', data: activity };
  }
}
