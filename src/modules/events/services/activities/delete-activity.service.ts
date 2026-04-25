import { inject, injectable } from 'tsyringe';
import IActivityRepositoryProvider from '../../infra/orm/repositories/providers/activity-repository.provider';
import IUserOrganizationRepositoryProvider from '../../../users/infra/orm/repositories/providers/user-organization-repository.provider';
import UserOrganizationQueryOptions from '../../../users/dtos/user-organization/user-organization-query-options';
import AppError from '../../../../shared/infra/http/errors/app-error';

@injectable()
export class DeleteActivityService {
  constructor(
    @inject('ActivityRepositoryProvider')
    private activityRepository: IActivityRepositoryProvider,
    @inject('UserOrganizationRepositoryProvider')
    private userOrganizationRepository: IUserOrganizationRepositoryProvider,
  ) {}

  public async execute(user_id: string, activity_id: string) {
    const activity = (await this.activityRepository.find({ id: activity_id })).at(0);

    if (!activity) {
      throw new AppError(404, 'Activity not found.', 'Atividade nao encontrada.');
    }

    const userPermissionQueryOptions = {
      user_id,
      organization_id: activity.organization.id,
    } as UserOrganizationQueryOptions;

    const userOrganization = (await this.userOrganizationRepository.find(userPermissionQueryOptions)).at(0);

    if (!userOrganization) {
      throw new AppError(
        403,
        'User does not have permission to delete activity in this organization.',
        'Usuario nao tem permissao para deletar atividade nesta organizacao.',
      );
    }

    const rowsDeleted = await this.activityRepository.delete(activity_id);
    return { message: 'Activity deleted successfully.', deleted: rowsDeleted };
  }
}
