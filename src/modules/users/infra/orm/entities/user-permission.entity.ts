import { CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, Unique, UpdateDateColumn } from 'typeorm';
import { SequentialGeneratedUUID } from '../../../../../shared/infra/orm/entities/sequential-generated-uuid.entity';
import { User } from './user.entity';
import { Permission } from './permission.entity';
import { Organization } from './organization.entity';

@Entity('user_permissions')
@Unique(['user', 'organization', 'permission'])
class UserPermission extends SequentialGeneratedUUID {
  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;

  @DeleteDateColumn({ type: 'timestamptz' })
  deleted_at: Date;

  @ManyToOne(() => User, user => user.userPermissions)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Organization, organization => organization.userPermissions)
  @JoinColumn({ name: 'organization_id' })
  organization: Organization;

  @ManyToOne(() => Permission, permission => permission.userPermissions)
  @JoinColumn({ name: 'permission_id' })
  permission: Permission;
}
export { UserPermission };
