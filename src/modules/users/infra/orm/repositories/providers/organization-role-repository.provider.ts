import IRepositoryProvider from '../../../../../../shared/infra/orm/repositories/providers/repository.provider';
import { OrganizationRole } from '../../entities/organization-role.entity';

type IOrganizationRoleRepositoryProvider = IRepositoryProvider<OrganizationRole>;

export default IOrganizationRoleRepositoryProvider;
