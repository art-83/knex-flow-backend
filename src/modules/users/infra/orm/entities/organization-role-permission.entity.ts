import {
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { OrganizationRole } from './organization-role.entity';
import { Permission } from './permission.entity';

@Entity('organization_role_permissions')
export class OrganizationRolePermission {
  @PrimaryGeneratedColumn('uuid')
  id: string;

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
