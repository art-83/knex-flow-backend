import IRepositoryProvider from '../../../../../../shared/infra/orm/repositories/providers/repository.provider';
import { UserOrganization } from '../../entities/user-organization.entity';

interface IUserOrganizationRepositoryProvider extends IRepositoryProvider<UserOrganization> {}

export default IUserOrganizationRepositoryProvider;
