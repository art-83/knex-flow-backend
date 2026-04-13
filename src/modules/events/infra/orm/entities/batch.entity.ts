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
import { Event } from './event.entity';
import { Ticket } from './ticket.entity';

@Entity({ name: 'batches' })
export class Batch {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'int' })
  base_quantity: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;

  @ManyToOne(() => Event, (event) => event.batches, { nullable: false })
  @JoinColumn({ name: 'event_id' })
  event: Event;

  @OneToMany(() => Ticket, (ticket) => ticket.batch)
  tickets: Ticket[];
}

export default Batch;
