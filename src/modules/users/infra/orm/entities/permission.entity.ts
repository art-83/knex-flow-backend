import { Column, CreateDateColumn, DeleteDateColumn, Entity, OneToMany, UpdateDateColumn } from 'typeorm';
import { SequentialGeneratedUUID } from '../../../../../shared/infra/orm/entities/sequential-generated-uuid.entity';
import { UserPermission } from './user-permission.entity';
import { OrganizationRolePermission } from './organization-role-permission.entity';

@Entity('permissions')
export class Permission extends SequentialGeneratedUUID {
  @Column()
  description: string;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;

  @DeleteDateColumn({ type: 'timestamptz' })
  deleted_at: Date;

  @OneToMany(() => UserPermission, userPermission => userPermission.permission)
  userPermissions: UserPermission[];

  @OneToMany(() => OrganizationRolePermission, organizationRolePermission => organizationRolePermission.permission)
  organizationRolePermissions: OrganizationRolePermission[];
}

export default Permission;
