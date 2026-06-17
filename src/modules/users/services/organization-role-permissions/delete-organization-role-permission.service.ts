import { inject, injectable } from 'tsyringe';
import { IOrganizationRolePermissionRepositoryProvider } from '../../infra/orm/repositories/providers/organization-role-permission-repository.provider';
import { AppError } from '../../../../shared/infra/http/errors/app-error';
import { AuthorizeOrganizationActionService } from '../../../../shared/infra/http/authorization';
import { PermissionDescriptionEnum } from '../../infra/orm/enums/permission-description.enum';

@injectable()
class DeleteOrganizationRolePermissionService {
  constructor(
    @inject('OrganizationRolePermissionRepositoryProvider')
    private organizationRolePermissionRepository: IOrganizationRolePermissionRepositoryProvider,
    private authorizeOrganizationActionService: AuthorizeOrganizationActionService,
  ) {}

  public async execute(user_id: string, id: string, organization_id: string) {
    await this.authorizeOrganizationActionService.authorize(
      user_id,
      organization_id,
      PermissionDescriptionEnum.ORGANIZATION_ROLE_PERMISSION_DELETE,
    );

    const existingRelation = (
      await this.organizationRolePermissionRepository.find({
        id,
        organization_id,
      })
    ).at(0);

    if (!existingRelation) {
      throw new AppError(
        404,
        'Organization role permission relation not found.',
        'Vinculo de permissao com papel da organizacao nao encontrado.',
      );
    }

    const deletedCount = await this.organizationRolePermissionRepository.delete(id);

    return {
      message: 'Organization role permission deleted successfully.',
      affected_rows: deletedCount,
    };
  }
}
export { DeleteOrganizationRolePermissionService };
