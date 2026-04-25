import { inject, injectable } from 'tsyringe';
import IOrganizationRoleRepositoryProvider from '../../infra/orm/repositories/providers/organization-role-repository.provider';
import IOrganizationRepositoryProvider from '../../infra/orm/repositories/providers/organization-repository.provider';
import AppError from '../../../../shared/infra/http/errors/app-error';
import CreateOrUpdateOrganizationRoleDTO from '../../dtos/organization-role/create-or-update-organization-role.dto';
import OrganizationRoleQueryOptions from '../../dtos/organization-role/organization-role-query-options';
import EnsureUserOrganizationAccessService from '../authorization/ensure-user-organization-access.service';
import EnsureUserHasPermissionService from '../authorization/ensure-user-has-permission.service';
import PermissionDescriptionEnum from '../../enums/permission-description.enum';

@injectable()
class OrganizationRoleCrudService {
  constructor(
    @inject('OrganizationRoleRepositoryProvider')
    private organizationRoleRepository: IOrganizationRoleRepositoryProvider,
    @inject('OrganizationRepositoryProvider')
    private organizationRepository: IOrganizationRepositoryProvider,
    private ensureUserOrganizationAccessService: EnsureUserOrganizationAccessService,
    private ensureUserHasPermissionService: EnsureUserHasPermissionService,
  ) {}

  private isUniqueViolation(error: unknown): boolean {
    return Boolean(
      error && typeof error === 'object' && 'code' in error && (error as { code: string }).code === '23505',
    );
  }

  public async create(user_id: string, data: CreateOrUpdateOrganizationRoleDTO) {
    await this.ensureUserOrganizationAccessService.execute(user_id, data.organization_id);
    await this.ensureUserHasPermissionService.execute(
      user_id,
      data.organization_id,
      PermissionDescriptionEnum.ORGANIZATION_ROLE_CREATE,
    );

    const organization = (await this.organizationRepository.find({ id: data.organization_id })).at(0);

    if (!organization) {
      throw new AppError(404, 'Organization not found.', 'Organizacao nao encontrada.');
    }

    const conflictingRole = (
      await this.organizationRoleRepository.find({
        organization_id: data.organization_id,
        name: data.name,
      })
    ).find(item => item.name.trim().toLowerCase() === data.name.trim().toLowerCase());

    if (conflictingRole) {
      throw new AppError(409, 'Organization role already exists.', 'Papel da organizacao ja existe.');
    }

    let organizationRole;

    try {
      organizationRole = await this.organizationRoleRepository.create({
        name: data.name,
        description: data.description,
        organization,
      });
    } catch (error) {
      if (this.isUniqueViolation(error)) {
        throw new AppError(409, 'Organization role already exists.', 'Papel da organizacao ja existe.');
      }

      throw error;
    }

    return {
      message: 'Organization role created successfully.',
      data: organizationRole,
    };
  }

  public async find(user_id: string, data: Partial<OrganizationRoleQueryOptions>) {
    if (!data.organization_id) {
      throw new AppError(400, 'organization_id is required.', 'organization_id e obrigatorio.');
    }

    await this.ensureUserOrganizationAccessService.execute(user_id, data.organization_id);
    await this.ensureUserHasPermissionService.execute(
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

  public async update(user_id: string, id: string, data: CreateOrUpdateOrganizationRoleDTO) {
    await this.ensureUserOrganizationAccessService.execute(user_id, data.organization_id);
    await this.ensureUserHasPermissionService.execute(
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

    let organizationRole;

    try {
      organizationRole = await this.organizationRoleRepository.update(id, {
        ...existingRole,
        name: data.name,
        description: data.description,
        organization,
      });
    } catch (error) {
      if (this.isUniqueViolation(error)) {
        throw new AppError(409, 'Organization role already exists.', 'Papel da organizacao ja existe.');
      }

      throw error;
    }

    return {
      message: 'Organization role updated successfully.',
      data: organizationRole,
    };
  }

  public async delete(user_id: string, id: string, organization_id: string) {
    await this.ensureUserOrganizationAccessService.execute(user_id, organization_id);
    await this.ensureUserHasPermissionService.execute(
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

export default OrganizationRoleCrudService;
