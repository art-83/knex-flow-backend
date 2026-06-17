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
import { Activity } from './activity.entity';
import { EventActivityPresence } from './event-activity-presence.entity';

@Entity({ name: 'event_activities' })
class EventActivity extends SequentialGeneratedUUID {
  @Column({ nullable: true })
  hours_to_retrieve: number;

  @Column()
  max_participants: number;

  @Column({ type: 'timestamptz' })
  start_date: Date;

  @Column({ type: 'timestamptz' })
  end_date: Date;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;

  @DeleteDateColumn({ type: 'timestamptz' })
  deleted_at: Date;

  @ManyToOne(() => Event, event => event.event_activities, { nullable: false })
  @JoinColumn({ name: 'event_id' })
  event: Event;

  @ManyToOne(() => Activity, activity => activity.event_activities, { nullable: false })
  @JoinColumn({ name: 'activity_id' })
  activity: Activity;

  @OneToMany(() => EventActivityPresence, eventActivityOrder => eventActivityOrder.event_activity)
  event_activity_orders: EventActivityPresence[];
}
export { EventActivity };
