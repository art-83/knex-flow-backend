import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserPermission } from './user-permission.entity';
import { OrganizationRolePermission } from './organization-role-permission.entity';

@Entity('permissions')
export class Permission {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  description: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;

  @OneToMany(() => UserPermission, userPermission => userPermission.permission)
  userPermissions: UserPermission[];

  @OneToMany(() => OrganizationRolePermission, organizationRolePermission => organizationRolePermission.permission)
  organizationRolePermissions: OrganizationRolePermission[];
}

export default Permission;
