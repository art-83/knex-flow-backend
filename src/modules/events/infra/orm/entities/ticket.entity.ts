import { Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Batch } from './batch.entity';
import { Order } from './order.entity';
import { BaseEntitySequentialGeneratedUUID } from '../../../../../shared/infra/orm/entities/base-entity-sequential-generated-uuid.entity';

@Entity({ name: 'tickets' })
class Ticket extends BaseEntitySequentialGeneratedUUID {
  @ManyToOne(() => Batch, batch => batch.tickets, { nullable: false })
  @JoinColumn({ name: 'batch_id' })
  batch: Batch;

  @ManyToOne(() => Order, order => order.tickets, { nullable: true })
  @JoinColumn({ name: 'order_id' })
  order: Order;
}
export { Ticket };
