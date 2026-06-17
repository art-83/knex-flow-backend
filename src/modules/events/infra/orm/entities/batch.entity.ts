import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  UpdateDateColumn,
} from 'typeorm';
import { SequentialGeneratedUUID } from '../../../../../shared/infra/orm/entities/sequential-generated-uuid.entity';
import { Event } from './event.entity';
import { Ticket } from './ticket.entity';

@Entity({ name: 'batches' })
class Batch extends SequentialGeneratedUUID {
  @Column({ type: 'int' })
  base_quantity: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;

  @DeleteDateColumn({ type: 'timestamptz' })
  deleted_at: Date;

  @ManyToOne(() => Event, event => event.batches, { nullable: false })
  @JoinColumn({ name: 'event_id' })
  event: Event;

  @OneToMany(() => Ticket, ticket => ticket.batch)
  tickets: Ticket[];
}
export { Batch };
