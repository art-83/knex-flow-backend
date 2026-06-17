import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntitySequentialGeneratedUUID } from '../../../../../shared/infra/orm/entities/base-entity-sequential-generated-uuid.entity';
import { UserPermission } from './user-permission.entity';
import { OrganizationRolePermission } from './organization-role-permission.entity';

@Entity('permissions')
class Permission extends BaseEntitySequentialGeneratedUUID {
  @Column()
  description: string;

  @OneToMany(() => UserPermission, userPermission => userPermission.permission)
  user_permissions: UserPermission[];

  @OneToMany(() => OrganizationRolePermission, organizationRolePermission => organizationRolePermission.permission)
  organization_role_permissions: OrganizationRolePermission[];
}
export { Permission };
