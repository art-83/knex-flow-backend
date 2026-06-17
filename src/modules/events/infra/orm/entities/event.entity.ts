import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  UpdateDateColumn,
} from 'typeorm';
import { SequentialGeneratedUUID } from '../../../../../shared/infra/orm/entities/sequential-generated-uuid.entity';
import { EventConfiguration } from './event-configuration.entity';
import { Batch } from './batch.entity';
import { EventActivity } from './event-activity.entity';
import { Organization } from '../../../../users/infra/orm/entities/organization.entity';
import { Address } from './address.entity';
import { EventModality } from '../enums/event-modality.enum';

@Entity({ name: 'events' })
class Event extends SequentialGeneratedUUID {
  @Column()
  name: string;

  @Column({ type: 'text' })
  description: string;

  @ManyToOne(() => Organization, organization => organization.events, { nullable: false })
  @JoinColumn({ name: 'organization_id' })
  organization: Organization;

  @Column({ type: 'timestamptz' })
  start_date: Date;

  @Column({ type: 'timestamptz' })
  end_date: Date;

  @Column({ type: 'enum', enum: EventModality })
  modality: EventModality;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;

  @DeleteDateColumn({ type: 'timestamptz' })
  deleted_at: Date;

  @OneToOne(() => EventConfiguration, config => config.event)
  configuration: EventConfiguration;

  @OneToMany(() => Batch, batch => batch.event)
  batches: Batch[];

  @OneToMany(() => EventActivity, ea => ea.event)
  event_activities: EventActivity[];

  @OneToOne(() => Address, address => address.event, { nullable: true })
  @JoinColumn({ name: 'address_id' })
  address: Address;
}
export { Event };
