import { inject, injectable } from 'tsyringe';
import IUserPermissionRepositoryProvider from '../../infra/orm/repositories/providers/user-permission-repository.provider';
import AppError from '../../../../shared/infra/http/errors/app-error';
import UserPermissionQueryOptions from '../../dtos/user-permission/user-permission-query-options';
import EnsureUserOrganizationAccessService from '../../../../shared/infra/http/authorization/ensure-user-organization-access.service';
import EnsureUserHasPermissionService from '../../../../shared/infra/http/authorization/ensure-user-has-permission.service';
import PermissionDescriptionEnum from '../../enums/permission-description.enum';

@injectable()
class FindUserPermissionsService {
  constructor(
    @inject('UserPermissionRepositoryProvider')
    private userPermissionRepository: IUserPermissionRepositoryProvider,
    private ensureUserOrganizationAccessService: EnsureUserOrganizationAccessService,
    private ensureUserHasPermissionService: EnsureUserHasPermissionService,
  ) {}

  public async execute(user_id: string, data: Partial<UserPermissionQueryOptions>) {
    if (!data.organization_id) {
      throw new AppError(400, 'organization_id is required.', 'organization_id e obrigatorio.');
    }

    await this.ensureUserOrganizationAccessService.execute(user_id, data.organization_id);
    await this.ensureUserHasPermissionService.execute(
      user_id,
      data.organization_id,
      PermissionDescriptionEnum.USER_PERMISSION_READ,
    );

    const userPermissions = await this.userPermissionRepository.find(data);

    return {
      message: 'User permissions retrieved successfully.',
      data: userPermissions,
    };
  }
}

export default FindUserPermissionsService;
