import { CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, Unique, UpdateDateColumn } from 'typeorm';
import { SequentialGeneratedUUID } from '../../../../../shared/infra/orm/entities/sequential-generated-uuid.entity';
import { OrganizationRole } from './organization-role.entity';
import { Permission } from './permission.entity';

@Entity('organization_role_permissions')
@Unique(['organizationRole', 'permission'])
export class OrganizationRolePermission extends SequentialGeneratedUUID {
  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;

  @DeleteDateColumn({ type: 'timestamptz' })
  deleted_at: Date;

  @ManyToOne(() => OrganizationRole, organizationRole => organizationRole.organizationRolePermissions)
  @JoinColumn({ name: 'organization_role_id' })
  organizationRole: OrganizationRole;

  @ManyToOne(() => Permission, permission => permission.organizationRolePermissions)
  @JoinColumn({ name: 'permission_id' })
  permission: Permission;
}

export default OrganizationRolePermission;
