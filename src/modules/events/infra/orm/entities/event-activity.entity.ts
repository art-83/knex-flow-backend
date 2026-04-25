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
import { Activity } from './activity.entity';
import { EventActivityOrder } from './event-activity-order.entity';

@Entity({ name: 'event_activities' })
export class EventActivity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
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

  @OneToMany(() => EventActivityOrder, eventActivityOrder => eventActivityOrder.event_activity)
  event_activity_orders: EventActivityOrder[];
}

export default EventActivity;
