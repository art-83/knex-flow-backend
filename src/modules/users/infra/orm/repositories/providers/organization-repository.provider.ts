import IRepositoryProvider from '../../../../../../shared/infra/orm/repositories/providers/repository.provider';
import { Organization } from '../../entities/organization.entity';

interface IOrganizationRepositoryProvider extends IRepositoryProvider<Organization> {}

export default IOrganizationRepositoryProvider;
