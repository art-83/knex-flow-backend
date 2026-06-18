import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntitySequentialGeneratedUUID } from '../../../../../shared/infra/orm/entities/base-entity-sequential-generated-uuid.entity';
import { UserOrganization } from './user-organization.entity';
import { UserPermission } from './user-permission.entity';
import { Order } from '../../../../events/infra/orm/entities/order.entity';
import { EventActivityInvited } from '../../../../events/infra/orm/entities/event-activity-invited.entity';
import { File } from '../../../../files/infra/orm/entities/file.entity';

@Entity('users')
class User extends BaseEntitySequentialGeneratedUUID {
  @Column({ unique: true })
  email: string;

  @Column({ select: false })
  password: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  cpf: string;

  @Column({ nullable: true })
  institution: string;

  @Column({ nullable: true })
  profession: string;

  @OneToMany(() => UserOrganization, userOrganization => userOrganization.user)
  user_organizations: UserOrganization[];

  @OneToMany(() => UserPermission, userPermission => userPermission.user)
  user_permissions: UserPermission[];

  @OneToMany(() => Order, order => order.user)
  orders: Order[];

  @OneToMany(() => EventActivityInvited, eventActivityInvited => eventActivityInvited.user)
  event_activity_invited: EventActivityInvited[];

  @OneToMany(() => File, file => file.user)
  files: File[];
}
export { User };
