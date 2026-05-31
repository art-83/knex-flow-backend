import { CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, UpdateDateColumn } from 'typeorm';
import { Batch } from './batch.entity';
import { Order } from './order.entity';
import { SequentialGeneratedUUID } from '../../../../../shared/infra/orm/entities/sequential-generated-uuid.entity';

@Entity({ name: 'tickets' })
export class Ticket extends SequentialGeneratedUUID {
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
