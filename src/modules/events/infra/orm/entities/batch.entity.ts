import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntitySequentialGeneratedUUID } from '../../../../../shared/infra/orm/entities/base-entity-sequential-generated-uuid.entity';
import { Event } from './event.entity';
import { Ticket } from './ticket.entity';

@Entity({ name: 'batches' })
class Batch extends BaseEntitySequentialGeneratedUUID {
  @Column({ type: 'int' })
  base_quantity: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @ManyToOne(() => Event, event => event.batches, { nullable: false })
  @JoinColumn({ name: 'event_id' })
  event: Event;

  @OneToMany(() => Ticket, ticket => ticket.batch)
  tickets: Ticket[];
}
export { Batch };
