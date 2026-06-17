import { Column, CreateDateColumn, DeleteDateColumn, Entity, OneToMany, UpdateDateColumn } from 'typeorm';
import { SequentialGeneratedUUID } from '../../../../../shared/infra/orm/entities/sequential-generated-uuid.entity';
import { UserOrganization } from './user-organization.entity';
import { UserPermission } from './user-permission.entity';
import { Order } from '../../../../events/infra/orm/entities/order.entity';

@Entity('users')
export class User extends SequentialGeneratedUUID {
  @Column({ unique: true })
  email: string;

  @Column({ select: false })
  password: string;

  @Column({ nullable: true })
  phone: string;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;

  @DeleteDateColumn({ type: 'timestamptz' })
  deleted_at: Date;

  @OneToMany(() => UserOrganization, userOrganization => userOrganization.user)
  userOrganizations: UserOrganization[];

  @OneToMany(() => UserPermission, userPermission => userPermission.user)
  userPermissions: UserPermission[];

  @OneToMany(() => Order, order => order.user)
  orders: Order[];
}

export default User;
