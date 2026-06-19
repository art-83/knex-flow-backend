import { UserPermission } from '../infra/orm/entities/user-permission.entity';

function mapUserPermission(userPermission: UserPermission) {
  return {
    id: userPermission.id,
    user_id: userPermission.user?.id ?? null,
    organization_id: userPermission.organization?.id ?? null,
    permission_id: userPermission.permission?.id ?? null,
    permission_description: userPermission.permission?.description ?? null,
    created_at: userPermission.created_at,
    updated_at: userPermission.updated_at,
  };
}
export { mapUserPermission };
