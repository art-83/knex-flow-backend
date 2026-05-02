import { inject, injectable } from 'tsyringe';
import IOrganizationRolePermissionRepositoryProvider from '../../infra/orm/repositories/providers/organization-role-permission-repository.provider';
import IOrganizationRoleRepositoryProvider from '../../infra/orm/repositories/providers/organization-role-repository.provider';
import IPermissionRepositoryProvider from '../../infra/orm/repositories/providers/permission-repository.provider';
import AppError from '../../../../shared/infra/http/errors/app-error';
import CreateOrUpdateOrganizationRolePermissionDTO from '../../dtos/organization-role-permission/create-or-update-organization-role-permission.dto';

@injectable()
class CreateOrganizationRolePermissionService {
  constructor(
    @inject('OrganizationRolePermissionRepositoryProvider')
    private organizationRolePermissionRepository: IOrganizationRolePermissionRepositoryProvider,
    @inject('OrganizationRoleRepositoryProvider')
    private organizationRoleRepository: IOrganizationRoleRepositoryProvider,
    @inject('PermissionRepositoryProvider')
    private permissionRepository: IPermissionRepositoryProvider,
  ) {}

  public async execute(user_id: string, organization_id: string, data: CreateOrUpdateOrganizationRolePermissionDTO) {
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

    const existingRelation = (
      await this.organizationRolePermissionRepository.find({
        organization_role_id: data.organization_role_id,
        permission_id: data.permission_id,
      })
    ).at(0);

    if (existingRelation) {
      throw new AppError(
        409,
        'Organization role permission relation already exists.',
        'Vinculo de permissao com papel da organizacao ja existe.',
      );
    }

    const organizationRolePermission = await this.organizationRolePermissionRepository.create({
      organizationRole,
      permission,
    });

    return {
      message: 'Organization role permission created successfully.',
      data: organizationRolePermission,
    };
  }
}

export default CreateOrganizationRolePermissionService;
