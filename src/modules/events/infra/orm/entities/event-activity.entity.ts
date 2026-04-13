import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Event } from './event.entity';
import { Activity } from './activity.entity';

@Entity({ name: 'event_activities' })
export class EventActivity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  start_date: Date;

  @Column()
  end_date: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;

  @ManyToOne(() => Event, (event) => event.event_activities, { nullable: false })
  @JoinColumn({ name: 'event_id' })
  event: Event;

  @ManyToOne(() => Activity, (activity) => activity.event_activities, { nullable: false })
  @JoinColumn({ name: 'activity_id' })
  activity: Activity;
}

export default EventActivity;
