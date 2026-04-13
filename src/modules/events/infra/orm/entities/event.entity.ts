import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { EventConfiguration } from './event-configuration.entity';
import { Batch } from './batch.entity';
import { EventActivity } from './event-activity.entity';
import { Organization } from '../../../../users/infra/orm/entities/organization.entity';

@Entity({ name: 'events' })
export class Event {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'text' })
  description: string;

  @ManyToOne(() => Organization, organization => organization.events, { nullable: false })
  @JoinColumn({ name: 'organization_id' })
  organization: Organization;

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

  @OneToOne(() => EventConfiguration, config => config.event)
  configuration: EventConfiguration;

  @OneToMany(() => Batch, batch => batch.event)
  batches: Batch[];

  @OneToMany(() => EventActivity, ea => ea.event)
  event_activities: EventActivity[];
}

export default Event;
