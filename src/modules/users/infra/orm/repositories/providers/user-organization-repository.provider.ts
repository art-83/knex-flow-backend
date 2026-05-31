import IRepositoryProvider from '../../../../../../shared/infra/orm/providers/repository.provider';
import { UserOrganization } from '../../entities/user-organization.entity';
import UserOrganizationQueryOptions from '../../../../dtos/user-organization/user-organization-query-options';

interface IUserOrganizationRepositoryProvider extends IRepositoryProvider<UserOrganization> {
  find(data: Partial<UserOrganizationQueryOptions>): Promise<UserOrganization[]>;
}

export default IUserOrganizationRepositoryProvider;
