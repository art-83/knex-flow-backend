import { IRepositoryProvider } from '../../../../../../shared/infra/orm/providers/repository.provider';
import { OrganizationRolePermission } from '../../entities/organization-role-permission.entity';
import { OrganizationRolePermissionQueryOptionsDTO } from '../../../../dtos/incoming/http/organization-role-permission/organization-role-permission-query-options.dto';

interface IOrganizationRolePermissionRepositoryProvider extends IRepositoryProvider<OrganizationRolePermission> {
  find(data: Partial<OrganizationRolePermissionQueryOptionsDTO>): Promise<OrganizationRolePermission[]>;
}
export { IOrganizationRolePermissionRepositoryProvider };
