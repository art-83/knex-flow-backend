import {
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Batch } from './batch.entity';
import { Order } from './order.entity';

@Entity({ name: 'tickets' })
export class Ticket {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;

  @DeleteDateColumn({ type: 'timestamptz' })
  deleted_at: Date;

  @ManyToOne(() => Batch, batch => batch.tickets, { nullable: false })
  @JoinColumn({ name: 'batch_id' })
  batch: Batch;

  @ManyToOne(() => Order, order => order.tickets, { nullable: true })
  @JoinColumn({ name: 'order_id' })
  order: Order;
}

export default Ticket;
