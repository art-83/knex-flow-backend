import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { UserPermission } from './user-permission.entity';
import { OrganizationRolePermission } from './organization-role-permission.entity';

@Entity('permissions')
export class Permission {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  description: string;

  @OneToMany(() => UserPermission, userPermission => userPermission.permission)
  userPermissions: UserPermission[];

  @OneToMany(() => OrganizationRolePermission, organizationRolePermission => organizationRolePermission.permission)
  organizationRolePermissions: OrganizationRolePermission[];
}

export default Permission;
