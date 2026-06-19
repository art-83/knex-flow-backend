import { IRepositoryProvider } from '../../../../../../shared/infra/orm/providers/repository.provider';
import { UserOrganization } from '../../entities/user-organization.entity';
import { UserOrganizationQueryOptionsDTO } from '../../../../dtos/incoming/http/user-organization/user-organization-query-options.dto';

interface IUserOrganizationRepositoryProvider extends IRepositoryProvider<UserOrganization> {
  find(data: Partial<UserOrganizationQueryOptionsDTO>): Promise<UserOrganization[]>;
}
export { IUserOrganizationRepositoryProvider };
