import { inject, injectable } from 'tsyringe';
import IUserPermissionRepositoryProvider from '../../infra/orm/repositories/providers/user-permission-repository.provider';
import AppError from '../../../../shared/infra/http/errors/app-error';
import EnsureUserOrganizationAccessService from '../../../../shared/infra/http/authorization/ensure-user-organization-access.service';
import EnsureUserHasPermissionService from '../../../../shared/infra/http/authorization/ensure-user-has-permission.service';
import PermissionDescriptionEnum from '../../infra/orm/enums/permission-description.enum';

@injectable()
class DeleteUserPermissionService {
  constructor(
    @inject('UserPermissionRepositoryProvider')
    private userPermissionRepository: IUserPermissionRepositoryProvider,
    private ensureUserOrganizationAccessService: EnsureUserOrganizationAccessService,
    private ensureUserHasPermissionService: EnsureUserHasPermissionService,
  ) {}

  public async execute(user_id: string, id: string, organization_id: string) {
    await this.ensureUserOrganizationAccessService.execute(user_id, organization_id);
    await this.ensureUserHasPermissionService.execute(
      user_id,
      organization_id,
      PermissionDescriptionEnum.USER_PERMISSION_DELETE,
    );

    const existingRelation = (
      await this.userPermissionRepository.find({
        id,
        organization_id,
      })
    ).at(0);

    if (!existingRelation) {
      throw new AppError(404, 'User permission not found.', 'Permissao do usuario nao encontrada.');
    }

    await this.userPermissionRepository.delete(id);

    return {
      message: 'User permission deleted successfully.',
    };
  }
}

export default DeleteUserPermissionService;
