import IRepositoryProvider from '../../../../../../shared/infra/orm/repositories/providers/repository.provider';
import { Permission } from '../../entities/permission.entity';

interface IPermissionRepositoryProvider extends IRepositoryProvider<Permission> {}

export default IPermissionRepositoryProvider;
