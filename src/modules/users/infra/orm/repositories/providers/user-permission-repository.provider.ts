import IRepositoryProvider from '../../../../../../shared/infra/orm/repositories/providers/repository.provider';
import { UserPermission } from '../../entities/user-permission.entity';

interface IUserPermissionRepositoryProvider extends IRepositoryProvider<UserPermission> {}

export default IUserPermissionRepositoryProvider;
