import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { OrderStatus } from '../enums/order-status.enum';
import { Ticket } from './ticket.entity';
import { User } from '../../../../users/infra/orm/entities/user.entity';
import { Payment } from '../../../../payments/infra/orm/entities/payment.entity';
import { EventActivityPresence } from './event-activity-presence.entity';

@Entity({ name: 'orders' })
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  total_amount: number;

  @ManyToOne(() => User, user => user.orders, { nullable: false })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'enum', enum: OrderStatus })
  status: OrderStatus;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;

  @DeleteDateColumn({ type: 'timestamptz' })
  deleted_at: Date;

  @OneToMany(() => Ticket, ticket => ticket.order)
  tickets: Ticket[];

  @OneToMany(() => Payment, payment => payment.order)
  payments: Payment[];

  @OneToMany(() => EventActivityPresence, eventActivityOrder => eventActivityOrder.order)
  event_activity_orders: EventActivityPresence[];
}

export default Order;
