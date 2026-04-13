import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserOrganization } from './user-organization.entity';
import { UserPermission } from './user-permission.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  email: string;

  @Column({ select: false })
  password: string;

  @Column({ nullable: true })
  phone: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;

  @OneToMany(() => UserOrganization, userOrganization => userOrganization.user)
  userOrganizations: UserOrganization[];

  @OneToMany(() => UserPermission, userPermission => userPermission.user)
  userPermissions: UserPermission[];
}

export default User;
