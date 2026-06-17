import { IRepositoryProvider } from '../../../../../../shared/infra/orm/providers/repository.provider';
import { Permission } from '../../entities/permission.entity';

interface IPermissionRepositoryProvider extends IRepositoryProvider<Permission> {}
export { IPermissionRepositoryProvider };
