import { inject, injectable } from 'tsyringe';
import { IOrganizationRoleRepositoryProvider } from '../../infra/orm/repositories/providers/organization-role-repository.provider';
import { AppError } from '../../../../shared/infra/http/errors/app-error';
import { OrganizationRoleQueryOptions } from '../../dtos/organization-role/organization-role-query-options';
import { AuthorizeOrganizationActionService } from '../../../../shared/infra/http/authorization';
import { PermissionDescriptionEnum } from '../../infra/orm/enums/permission-description.enum';

@injectable()
class FindOrganizationRolesService {
  constructor(
    @inject('OrganizationRoleRepositoryProvider')
    private organizationRoleRepository: IOrganizationRoleRepositoryProvider,
    private authorizeOrganizationActionService: AuthorizeOrganizationActionService,
  ) {}

  public async execute(user_id: string, data: Partial<OrganizationRoleQueryOptions>) {
    if (!data.organization_id) {
      throw new AppError(400, 'organization_id is required.', 'organization_id e obrigatorio.');
    }

    await this.authorizeOrganizationActionService.authorize(
      user_id,
      data.organization_id,
      PermissionDescriptionEnum.ORGANIZATION_ROLE_READ,
    );

    const organizationRoles = await this.organizationRoleRepository.find(data);

    return {
      message: 'Organization roles retrieved successfully.',
      data: organizationRoles,
    };
  }
}
export { FindOrganizationRolesService };
