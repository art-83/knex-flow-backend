import { Entity, JoinColumn, ManyToOne, Unique } from 'typeorm';
import { BaseEntitySequentialGeneratedUUID } from '../../../../../shared/infra/orm/entities/base-entity-sequential-generated-uuid.entity';
import { User } from './user.entity';
import { Permission } from './permission.entity';
import { Organization } from './organization.entity';

@Entity('user_permissions')
@Unique(['user', 'organization', 'permission'])
class UserPermission extends BaseEntitySequentialGeneratedUUID {
  @ManyToOne(() => User, user => user.user_permissions)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Organization, organization => organization.user_permissions)
  @JoinColumn({ name: 'organization_id' })
  organization: Organization;

  @ManyToOne(() => Permission, permission => permission.user_permissions)
  @JoinColumn({ name: 'permission_id' })
  permission: Permission;
}
export { UserPermission };
