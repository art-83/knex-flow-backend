import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntitySequentialGeneratedUUID } from '../../../../../shared/infra/orm/entities/base-entity-sequential-generated-uuid.entity';
import { EventActivity } from './event-activity.entity';
import { Order } from './order.entity';

@Entity({ name: 'event_activity_presences' })
class EventActivityPresence extends BaseEntitySequentialGeneratedUUID {
  @Column({ type: 'boolean', default: false })
  user_presence: boolean;

  @ManyToOne(() => EventActivity, eventActivity => eventActivity.event_activity_presences, { nullable: false })
  @JoinColumn({ name: 'event_activity_id' })
  event_activity: EventActivity;

  @ManyToOne(() => Order, order => order.event_activity_presences, { nullable: true })
  @JoinColumn({ name: 'order_id' })
  order: Order;
}
export { EventActivityPresence };
