import IRepositoryProvider from '../../../../../../shared/infra/orm/repositories/providers/repository.provider';
import { Organization } from '../../entities/organization.entity';

type IOrganizationRepositoryProvider = IRepositoryProvider<Organization>;

export default IOrganizationRepositoryProvider;
