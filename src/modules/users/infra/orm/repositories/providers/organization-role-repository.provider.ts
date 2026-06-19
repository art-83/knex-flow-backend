import { IRepositoryProvider } from '../../../../../../shared/infra/orm/providers/repository.provider';
import { OrganizationRole } from '../../entities/organization-role.entity';
import { OrganizationRoleQueryOptionsDTO } from '../../../../dtos/incoming/http/organization-role/organization-role-query-options.dto';

interface IOrganizationRoleRepositoryProvider extends IRepositoryProvider<OrganizationRole> {
  find(data: Partial<OrganizationRoleQueryOptionsDTO>): Promise<OrganizationRole[]>;
}
export { IOrganizationRoleRepositoryProvider };
