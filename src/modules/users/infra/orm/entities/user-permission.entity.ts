import {
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Permission } from './permission.entity';

@Entity('user_permissions')
export class UserPermission {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;

  @ManyToOne(() => User, user => user.userPermissions)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Permission, permission => permission.userPermissions)
  @JoinColumn({ name: 'permission_id' })
  permission: Permission;
}

export default UserPermission;
