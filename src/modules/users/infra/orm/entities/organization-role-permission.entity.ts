import { Entity, JoinColumn, ManyToOne, Unique } from 'typeorm';
import { BaseEntitySequentialGeneratedUUID } from '../../../../../shared/infra/orm/entities/base-entity-sequential-generated-uuid.entity';
import { OrganizationRole } from './organization-role.entity';
import { Permission } from './permission.entity';

@Entity('organization_role_permissions')
@Unique(['organization_role', 'permission'])
class OrganizationRolePermission extends BaseEntitySequentialGeneratedUUID {
  @ManyToOne(() => OrganizationRole, organizationRole => organizationRole.organization_role_permissions)
  @JoinColumn({ name: 'organization_role_id' })
  organization_role: OrganizationRole;

  @ManyToOne(() => Permission, permission => permission.organization_role_permissions)
  @JoinColumn({ name: 'permission_id' })
  permission: Permission;
}
export { OrganizationRolePermission };
