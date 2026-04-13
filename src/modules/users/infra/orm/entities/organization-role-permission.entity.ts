import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { OrganizationRole } from './organization-role.entity';
import { Permission } from './permission.entity';

@Entity('organization_role_permissions')
export class OrganizationRolePermission {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => OrganizationRole, organizationRole => organizationRole.organizationRolePermissions)
  @JoinColumn({ name: 'organization_role_id' })
  organizationRole: OrganizationRole;

  @ManyToOne(() => Permission, permission => permission.organizationRolePermissions)
  @JoinColumn({ name: 'permission_id' })
  permission: Permission;
}

export default OrganizationRolePermission;
