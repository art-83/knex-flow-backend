import { inject, injectable } from 'tsyringe';
import { CreateOrUpdateActivityDTO } from '../../../events/dtos/activity/create-or-update-activity.dto';
import { IOrganizationRepositoryProvider } from '../../infra/orm/repositories/providers/organization-repository.provider';
import { IActivityRepositoryProvider } from '../../../events/infra/orm/repositories/providers/activity-repository.provider';
import { AppError } from '../../../../shared/infra/http/errors/app-error';
import { IUserOrganizationRepositoryProvider } from '../../infra/orm/repositories/providers/user-organization-repository.provider';
import { IPermissionRepositoryProvider } from '../../infra/orm/repositories/providers/permission-repository.provider';
import { IUserPermissionRepositoryProvider } from '../../infra/orm/repositories/providers/user-permission-repository.provider';
import { PermissionDescriptionEnum } from '../../infra/orm/enums/permission-description.enum';

@injectable()
class CreateActivityService {
  constructor(
    @inject('OrganizationRepositoryProvider')
    private organizationRepository: IOrganizationRepositoryProvider,
    @inject('ActivityRepositoryProvider')
    private activityRepositoryProvider: IActivityRepositoryProvider,
    @inject('UserOrganizationRepositoryProvider')
    private userOrganizationRepository: IUserOrganizationRepositoryProvider,
    @inject('PermissionRepositoryProvider')
    private permissionRepository: IPermissionRepositoryProvider,
    @inject('UserPermissionRepositoryProvider')
    private userPermissionRepository: IUserPermissionRepositoryProvider,
  ) {}

  public async execute(user_id: string, organization_id: string, data: Partial<CreateOrUpdateActivityDTO>) {
    const userOrganization = (await this.userOrganizationRepository.find({ user_id, organization_id })).at(0);

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
        organization_id,
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
