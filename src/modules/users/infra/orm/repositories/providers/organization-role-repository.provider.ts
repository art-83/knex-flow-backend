import IRepositoryProvider from '../../../../../../shared/infra/orm/infra/providers/repository.provider';
import { OrganizationRole } from '../../entities/organization-role.entity';
import OrganizationRoleQueryOptions from '../../../../dtos/organization-role/organization-role-query-options';

interface IOrganizationRoleRepositoryProvider extends IRepositoryProvider<OrganizationRole> {
  find(data: Partial<OrganizationRoleQueryOptions>): Promise<OrganizationRole[]>;
}

export default IOrganizationRoleRepositoryProvider;
