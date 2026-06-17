import { inject, injectable } from 'tsyringe';
import IOrganizationRoleRepositoryProvider from '../../infra/orm/repositories/providers/organization-role-repository.provider';
import AppError from '../../../../shared/infra/http/errors/app-error';
import EnsureUserCanActOnOrganizationService from '../../../../shared/infra/http/authorization/ensure-user-can-act-on-organization.service';
import PermissionDescriptionEnum from '../../infra/orm/enums/permission-description.enum';

@injectable()
class DeleteOrganizationRoleService {
  constructor(
    @inject('OrganizationRoleRepositoryProvider')
    private organizationRoleRepository: IOrganizationRoleRepositoryProvider,
    private ensureUserCanActOnOrganizationService: EnsureUserCanActOnOrganizationService,
  ) {}

  public async execute(user_id: string, id: string, organization_id: string) {
    await this.ensureUserCanActOnOrganizationService.execute(
      user_id,
      organization_id,
      PermissionDescriptionEnum.ORGANIZATION_ROLE_DELETE,
    );

    const existingRole = (await this.organizationRoleRepository.find({ id, organization_id })).at(0);

    if (!existingRole) {
      throw new AppError(404, 'Organization role not found.', 'Papel da organizacao nao encontrado.');
    }

    await this.organizationRoleRepository.delete(id);

    return {
      message: 'Organization role deleted successfully.',
    };
  }
}

export default DeleteOrganizationRoleService;
