import { IRepositoryProvider } from '../../../../../../shared/infra/orm/providers/repository.provider';
import { Address } from '../../entities/address.entity';

interface IAddressRepositoryProvider extends IRepositoryProvider<Address> {}
export { IAddressRepositoryProvider };
