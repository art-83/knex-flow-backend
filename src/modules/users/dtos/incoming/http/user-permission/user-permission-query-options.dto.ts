import { DefaultQueryOptionsDTO } from '../../../../../../shared/dtos/incoming/http/query/default-query-options.dto';
import { UserPermission } from '../../../../infra/orm/entities/user-permission.entity';

interface UserPermissionQueryOptionsDTO extends UserPermission, DefaultQueryOptionsDTO {
  user_id: string;
  organization_id: string;
  permission_id: string;
}
export { UserPermissionQueryOptionsDTO };
