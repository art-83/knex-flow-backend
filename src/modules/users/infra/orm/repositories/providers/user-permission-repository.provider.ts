import { IRepositoryProvider } from '../../../../../../shared/infra/orm/providers/repository.provider';
import { UserPermission } from '../../entities/user-permission.entity';
import { UserPermissionQueryOptionsDTO } from '../../../../dtos/incoming/http/user-permission/user-permission-query-options.dto';

interface IUserPermissionRepositoryProvider extends IRepositoryProvider<UserPermission> {
  find(data: Partial<UserPermissionQueryOptionsDTO>): Promise<UserPermission[]>;
}
export { IUserPermissionRepositoryProvider };
