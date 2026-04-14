import IRepositoryProvider from '../../../../../../shared/infra/orm/repositories/providers/repository.provider';
import { Permission } from '../../entities/permission.entity';

type IPermissionRepositoryProvider = IRepositoryProvider<Permission>;

export default IPermissionRepositoryProvider;
