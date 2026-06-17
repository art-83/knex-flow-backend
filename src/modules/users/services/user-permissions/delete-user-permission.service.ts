import { inject, injectable } from 'tsyringe';
import { IUserPermissionRepositoryProvider } from '../../infra/orm/repositories/providers/user-permission-repository.provider';
import { AppError } from '../../../../shared/infra/http/errors/app-error';
import { AuthorizeOrganizationActionService } from '../../../../shared/infra/http/authorization';
import { PermissionDescriptionEnum } from '../../infra/orm/enums/permission-description.enum';

@injectable()
class DeleteUserPermissionService {
  constructor(
    @inject('UserPermissionRepositoryProvider')
    private userPermissionRepository: IUserPermissionRepositoryProvider,
    private authorizeOrganizationActionService: AuthorizeOrganizationActionService,
  ) {}

  public async execute(user_id: string, id: string, organization_id: string) {
    await this.authorizeOrganizationActionService.authorize(
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
export { DeleteUserPermissionService };
