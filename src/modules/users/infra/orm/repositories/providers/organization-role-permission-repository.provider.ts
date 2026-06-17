import { IRepositoryProvider } from '../../../../../../shared/infra/orm/providers/repository.provider';
import { OrganizationRolePermission } from '../../entities/organization-role-permission.entity';
import { OrganizationRolePermissionQueryOptions } from '../../../../dtos/organization-role-permission/organization-role-permission-query-options';

interface IOrganizationRolePermissionRepositoryProvider extends IRepositoryProvider<OrganizationRolePermission> {
  find(data: Partial<OrganizationRolePermissionQueryOptions>): Promise<OrganizationRolePermission[]>;
}
export { IOrganizationRolePermissionRepositoryProvider };
