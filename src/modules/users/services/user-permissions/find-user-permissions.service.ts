import { inject, injectable } from 'tsyringe';
import { IUserPermissionRepositoryProvider } from '../../infra/orm/repositories/providers/user-permission-repository.provider';
import { AppError } from '../../../../shared/infra/http/errors/app-error';
import { UserPermissionQueryOptions } from '../../dtos/user-permission/user-permission-query-options';
import { AuthorizeOrganizationActionService } from '../../../../shared/infra/http/authorization';
import { PermissionDescriptionEnum } from '../../infra/orm/enums/permission-description.enum';

@injectable()
class FindUserPermissionsService {
  constructor(
    @inject('UserPermissionRepositoryProvider')
    private userPermissionRepository: IUserPermissionRepositoryProvider,
    private authorizeOrganizationActionService: AuthorizeOrganizationActionService,
  ) {}

  public async execute(user_id: string, data: Partial<UserPermissionQueryOptions>) {
    if (!data.organization_id) {
      throw new AppError(400, 'organization_id is required.', 'organization_id e obrigatorio.');
    }

    await this.authorizeOrganizationActionService.authorize(
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
export { FindUserPermissionsService };
