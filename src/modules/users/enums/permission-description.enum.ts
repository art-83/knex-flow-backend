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

  ACTIVITY_CREATE = 'activity:create',
  ACTIVITY_READ = 'activity:read',
  ACTIVITY_UPDATE = 'activity:update',
  ACTIVITY_DELETE = 'activity:delete',

  EVENT_CREATE = 'event:create',
  EVENT_READ = 'event:read',
  EVENT_UPDATE = 'event:update',
  EVENT_DELETE = 'event:delete',

  BATCH_CREATE = 'batch:create',
  BATCH_READ = 'batch:read',
  BATCH_UPDATE = 'batch:update',
  BATCH_DELETE = 'batch:delete',

  EVENT_ACTIVITY_CREATE = 'event_activity:create',
  EVENT_ACTIVITY_READ = 'event_activity:read',
  EVENT_ACTIVITY_UPDATE = 'event_activity:update',
  EVENT_ACTIVITY_DELETE = 'event_activity:delete',

  EVENT_CONFIGURATION_READ = 'event_configuration:read',
  EVENT_CONFIGURATION_UPDATE = 'event_configuration:update',
  EVENT_CONFIGURATION_DELETE = 'event_configuration:delete',
}

export default PermissionDescriptionEnum;
