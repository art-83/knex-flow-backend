import { inject, injectable } from 'tsyringe';
import IOrganizationRoleRepositoryProvider from '../../infra/orm/repositories/providers/organization-role-repository.provider';
import IOrganizationRepositoryProvider from '../../infra/orm/repositories/providers/organization-repository.provider';
import AppError from '../../../../shared/infra/http/errors/app-error';
import CreateOrUpdateOrganizationRoleDTO from '../../dtos/organization-role/create-or-update-organization-role.dto';
import EnsureUserCanActOnOrganizationService from '../../../../shared/infra/http/authorization/ensure-user-can-act-on-organization.service';
import PermissionDescriptionEnum from '../../enums/permission-description.enum';

@injectable()
class UpdateOrganizationRoleService {
  constructor(
    @inject('OrganizationRoleRepositoryProvider')
    private organizationRoleRepository: IOrganizationRoleRepositoryProvider,
    @inject('OrganizationRepositoryProvider')
    private organizationRepository: IOrganizationRepositoryProvider,
    private ensureUserCanActOnOrganizationService: EnsureUserCanActOnOrganizationService,
  ) {}

  public async execute(user_id: string, id: string, data: CreateOrUpdateOrganizationRoleDTO) {
    await this.ensureUserCanActOnOrganizationService.execute(
      user_id,
      data.organization_id,
      PermissionDescriptionEnum.ORGANIZATION_ROLE_UPDATE,
    );

    const existingRole = (await this.organizationRoleRepository.find({ id, organization_id: data.organization_id })).at(
      0,
    );

    if (!existingRole) {
      throw new AppError(404, 'Organization role not found.', 'Papel da organizacao nao encontrado.');
    }

    const organization = (await this.organizationRepository.find({ id: data.organization_id })).at(0);

    if (!organization) {
      throw new AppError(404, 'Organization not found.', 'Organizacao nao encontrada.');
    }

    const conflictingRole = (
      await this.organizationRoleRepository.find({
        organization_id: data.organization_id,
        name: data.name,
      })
    ).find(item => item.id !== id && item.name.trim().toLowerCase() === data.name.trim().toLowerCase());

    if (conflictingRole) {
      throw new AppError(409, 'Organization role already exists.', 'Papel da organizacao ja existe.');
    }

    const organizationRole = await this.organizationRoleRepository.update(id, {
      ...existingRole,
      name: data.name,
      description: data.description,
      organization,
    });

    return {
      message: 'Organization role updated successfully.',
      data: organizationRole,
    };
  }
}

export default UpdateOrganizationRoleService;
