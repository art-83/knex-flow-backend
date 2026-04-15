import DefaultQueryOptionsDTO from '../../../../shared/infra/orm/dtos/default-query-options.dto';
import { UserPermission } from '../../infra/orm/entities/user-permission.entity';

interface UserPermissionQueryOptions extends UserPermission, DefaultQueryOptionsDTO {
  user_id: string;
  permission_id: string;
}

export default UserPermissionQueryOptions;
