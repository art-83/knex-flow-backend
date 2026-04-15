import IRepositoryProvider from '../../../../../../shared/infra/orm/repositories/providers/repository.provider';
import { OrganizationRole } from '../../entities/organization-role.entity';

interface IOrganizationRoleRepositoryProvider extends IRepositoryProvider<OrganizationRole> {}

export default IOrganizationRoleRepositoryProvider;
