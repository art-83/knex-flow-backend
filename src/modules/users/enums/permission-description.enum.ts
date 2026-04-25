enum PermissionDescriptionEnum {
  ORGANIZATION_ROLE_CREATE = 'organization_role:create',
  ORGANIZATION_ROLE_READ = 'organization_role:read',
  ORGANIZATION_ROLE_UPDATE = 'organization_role:update',
  ORGANIZATION_ROLE_DELETE = 'organization_role:delete',

  ORGANIZATION_ROLE_PERMISSION_CREATE = 'organization_role_permission:create',
  ORGANIZATION_ROLE_PERMISSION_READ = 'organization_role_permission:read',
  ORGANIZATION_ROLE_PERMISSION_UPDATE = 'organization_role_permission:update',
  ORGANIZATION_ROLE_PERMISSION_DELETE = 'organization_role_permission:delete',

  USER_PERMISSION_CREATE = 'user_permission:create',
  USER_PERMISSION_READ = 'user_permission:read',
  USER_PERMISSION_UPDATE = 'user_permission:update',
  USER_PERMISSION_DELETE = 'user_permission:delete',
}

export default PermissionDescriptionEnum;
