import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { EventConfiguration } from './event-configuration.entity';
import { Batch } from './batch.entity';
import { EventActivity } from './event-activity.entity';

@Entity({ name: 'events' })
export class Event {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'text' })
  description: string;

  // TODO: adicionar @ManyToOne quando Organization existir
  @Column('uuid')
  organization_id: string;

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

  @OneToOne(() => EventConfiguration, (config) => config.event)
  configuration: EventConfiguration;

  @OneToMany(() => Batch, (batch) => batch.event)
  batches: Batch[];

  @OneToMany(() => EventActivity, (ea) => ea.event)
  event_activities: EventActivity[];
}

export default Event;
