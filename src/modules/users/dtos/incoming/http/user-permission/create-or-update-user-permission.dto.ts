import { UserPermission } from '../../../../infra/orm/entities/user-permission.entity';

interface CreateOrUpdateUserPermissionDTO extends UserPermission {
  user_id: string;
  organization_id: string;
  permission_id: string;
}
export { CreateOrUpdateUserPermissionDTO };
