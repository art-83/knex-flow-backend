import IRepositoryProvider from '../../../../../../shared/infra/orm/repositories/providers/repository.provider';
import { OrganizationRolePermission } from '../../entities/organization-role-permission.entity';

interface IOrganizationRolePermissionRepositoryProvider extends IRepositoryProvider<OrganizationRolePermission> {}

export default IOrganizationRolePermissionRepositoryProvider;
