import { inject, injectable } from 'tsyringe';
import IOrganizationRolePermissionRepositoryProvider from '../../infra/orm/repositories/providers/organization-role-permission-repository.provider';
import IOrganizationRoleRepositoryProvider from '../../infra/orm/repositories/providers/organization-role-repository.provider';
import IPermissionRepositoryProvider from '../../infra/orm/repositories/providers/permission-repository.provider';
import AppError from '../../../../shared/infra/http/errors/app-error';
import CreateOrUpdateOrganizationRolePermissionDTO from '../../dtos/organization-role-permission/create-or-update-organization-role-permission.dto';
import OrganizationRolePermissionQueryOptions from '../../dtos/organization-role-permission/organization-role-permission-query-options';
import EnsureUserOrganizationAccessService from '../authorization/ensure-user-organization-access.service';
import EnsureUserHasPermissionService from '../authorization/ensure-user-has-permission.service';
import PermissionDescriptionEnum from '../../enums/permission-description.enum';

@injectable()
class OrganizationRolePermissionCrudService {
  constructor(
    @inject('OrganizationRolePermissionRepositoryProvider')
    private organizationRolePermissionRepository: IOrganizationRolePermissionRepositoryProvider,
    @inject('OrganizationRoleRepositoryProvider')
    private organizationRoleRepository: IOrganizationRoleRepositoryProvider,
    @inject('PermissionRepositoryProvider')
    private permissionRepository: IPermissionRepositoryProvider,
    private ensureUserOrganizationAccessService: EnsureUserOrganizationAccessService,
    private ensureUserHasPermissionService: EnsureUserHasPermissionService,
  ) {}

  private isUniqueViolation(error: unknown): boolean {
    return Boolean(
      error && typeof error === 'object' && 'code' in error && (error as { code: string }).code === '23505',
    );
  }

  public async create(user_id: string, organization_id: string, data: CreateOrUpdateOrganizationRolePermissionDTO) {
    await this.ensureUserOrganizationAccessService.execute(user_id, organization_id);
    await this.ensureUserHasPermissionService.execute(
      user_id,
      organization_id,
      PermissionDescriptionEnum.ORGANIZATION_ROLE_PERMISSION_CREATE,
    );

    const organizationRole = (
      await this.organizationRoleRepository.find({
        id: data.organization_role_id,
        organization_id,
      })
    ).at(0);

    if (!organizationRole) {
      throw new AppError(404, 'Organization role not found.', 'Papel da organizacao nao encontrado.');
    }

    const permission = (await this.permissionRepository.find({ id: data.permission_id })).at(0);

    if (!permission) {
      throw new AppError(404, 'Permission not found.', 'Permissao nao encontrada.');
    }

    const conflictingRelation = (
      await this.organizationRolePermissionRepository.find({
        organization_id,
        organization_role_id: data.organization_role_id,
        permission_id: data.permission_id,
      })
    ).at(0);

    if (conflictingRelation) {
      throw new AppError(
        409,
        'Organization role permission relation already exists.',
        'Vinculo de permissao com papel da organizacao ja existe.',
      );
    }

    let organizationRolePermission;

    try {
      organizationRolePermission = await this.organizationRolePermissionRepository.create({
        organizationRole,
        permission,
      });
    } catch (error) {
      if (this.isUniqueViolation(error)) {
        throw new AppError(
          409,
          'Organization role permission relation already exists.',
          'Vinculo de permissao com papel da organizacao ja existe.',
        );
      }

      throw error;
    }

    return {
      message: 'Organization role permission created successfully.',
      data: organizationRolePermission,
    };
  }

  public async find(user_id: string, data: Partial<OrganizationRolePermissionQueryOptions>) {
    if (!data.organization_id) {
      throw new AppError(400, 'organization_id is required.', 'organization_id e obrigatorio.');
    }

    await this.ensureUserOrganizationAccessService.execute(user_id, data.organization_id);
    await this.ensureUserHasPermissionService.execute(
      user_id,
      data.organization_id,
      PermissionDescriptionEnum.ORGANIZATION_ROLE_PERMISSION_READ,
    );

    const organizationRolePermissions = await this.organizationRolePermissionRepository.find(data);

    return {
      message: 'Organization role permissions retrieved successfully.',
      data: organizationRolePermissions,
    };
  }

  public async update(
    user_id: string,
    id: string,
    organization_id: string,
    data: CreateOrUpdateOrganizationRolePermissionDTO,
  ) {
    await this.ensureUserOrganizationAccessService.execute(user_id, organization_id);
    await this.ensureUserHasPermissionService.execute(
      user_id,
      organization_id,
      PermissionDescriptionEnum.ORGANIZATION_ROLE_PERMISSION_UPDATE,
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

    const organizationRole = (
      await this.organizationRoleRepository.find({
        id: data.organization_role_id,
        organization_id,
      })
    ).at(0);

    if (!organizationRole) {
      throw new AppError(404, 'Organization role not found.', 'Papel da organizacao nao encontrado.');
    }

    const permission = (await this.permissionRepository.find({ id: data.permission_id })).at(0);

    if (!permission) {
      throw new AppError(404, 'Permission not found.', 'Permissao nao encontrada.');
    }

    const conflictingRelation = (
      await this.organizationRolePermissionRepository.find({
        organization_id,
        organization_role_id: data.organization_role_id,
        permission_id: data.permission_id,
      })
    ).find(item => item.id !== id);

    if (conflictingRelation) {
      throw new AppError(
        409,
        'Organization role permission relation already exists.',
        'Vinculo de permissao com papel da organizacao ja existe.',
      );
    }

    let organizationRolePermission;

    try {
      organizationRolePermission = await this.organizationRolePermissionRepository.update(id, {
        ...existingRelation,
        organizationRole,
        permission,
      });
    } catch (error) {
      if (this.isUniqueViolation(error)) {
        throw new AppError(
          409,
          'Organization role permission relation already exists.',
          'Vinculo de permissao com papel da organizacao ja existe.',
        );
      }

      throw error;
    }

    return {
      message: 'Organization role permission updated successfully.',
      data: organizationRolePermission,
    };
  }

  public async delete(user_id: string, id: string, organization_id: string) {
    await this.ensureUserOrganizationAccessService.execute(user_id, organization_id);
    await this.ensureUserHasPermissionService.execute(
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

    await this.organizationRolePermissionRepository.delete(id);

    return {
      message: 'Organization role permission deleted successfully.',
    };
  }
}

export default OrganizationRolePermissionCrudService;
