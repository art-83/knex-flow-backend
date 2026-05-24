import IRepositoryProvider from '../../../../../../shared/infra/orm/infra/providers/repository.provider';
import { UserPermission } from '../../entities/user-permission.entity';
import UserPermissionQueryOptions from '../../../../dtos/user-permission/user-permission-query-options';

interface IUserPermissionRepositoryProvider extends IRepositoryProvider<UserPermission> {
  find(data: Partial<UserPermissionQueryOptions>): Promise<UserPermission[]>;
}

export default IUserPermissionRepositoryProvider;
