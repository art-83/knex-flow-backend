import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, UpdateDateColumn } from 'typeorm';
import { SequentialGeneratedUUID } from '../../../../../shared/infra/orm/entities/sequential-generated-uuid.entity';
import { EventActivity } from './event-activity.entity';
import { Order } from './order.entity';

@Entity({ name: 'event_activity_presences' })
export class EventActivityPresence extends SequentialGeneratedUUID {
  @Column({ type: 'boolean', default: false })
  user_presence: boolean;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;

  @DeleteDateColumn({ type: 'timestamptz' })
  deleted_at: Date;

  @ManyToOne(() => EventActivity, eventActivity => eventActivity.event_activity_orders, { nullable: false })
  @JoinColumn({ name: 'event_activity_id' })
  event_activity: EventActivity;

  @ManyToOne(() => Order, order => order.event_activity_orders, { nullable: true })
  @JoinColumn({ name: 'order_id' })
  order: Order;
}

export default EventActivityPresence;
