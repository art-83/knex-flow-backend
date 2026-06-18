import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntitySequentialGeneratedUUID } from '../../../../../shared/infra/orm/entities/base-entity-sequential-generated-uuid.entity';
import { OrderStatus } from '../enums/order-status.enum';
import { Ticket } from './ticket.entity';
import { User } from '../../../../users/infra/orm/entities/user.entity';
import { Payment } from '../../../../payments/infra/orm/entities/payment.entity';

@Entity({ name: 'orders' })
class Order extends BaseEntitySequentialGeneratedUUID {
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  total_amount: number;

  @ManyToOne(() => User, user => user.orders, { nullable: false })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'enum', enum: OrderStatus })
  status: OrderStatus;

  @OneToMany(() => Ticket, ticket => ticket.order)
  tickets: Ticket[];

  @OneToMany(() => Payment, payment => payment.order)
  payments: Payment[];
}
export { Order };
