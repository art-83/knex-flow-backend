import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne } from 'typeorm';
import { BaseEntitySequentialGeneratedUUID } from '../../../../../shared/infra/orm/entities/base-entity-sequential-generated-uuid.entity';
import { Batch } from './batch.entity';
import { EventActivity } from './event-activity.entity';
import { Organization } from '../../../../users/infra/orm/entities/organization.entity';
import { Address } from './address.entity';
import { EventModality } from '../enums/event-modality.enum';
import { EventStatus } from '../enums/event-status.enum';

@Entity({ name: 'events' })
class Event extends BaseEntitySequentialGeneratedUUID {
  @Column()
  name: string;

  @Column({ type: 'text' })
  description: string;

  @ManyToOne(() => Organization, organization => organization.events, { nullable: false })
  @JoinColumn({ name: 'organization_id' })
  organization: Organization;

  @Column({ nullable: true })
  url_path: string;

  @Column({ type: 'enum', enum: EventStatus, default: EventStatus.DRAFT })
  status?: EventStatus;

  @Column({ type: 'timestamptz' })
  start_date: Date;

  @Column({ type: 'timestamptz' })
  end_date: Date;

  @Column({ type: 'enum', enum: EventModality, default: EventModality.OFFLINE })
  modality: EventModality;

  @Column({ type: 'jsonb', nullable: true })
  configuration: Record<string, any> | null;

  @OneToMany(() => Batch, batch => batch.event)
  batches: Batch[];

  @OneToMany(() => EventActivity, ea => ea.event)
  event_activities: EventActivity[];

  @OneToOne(() => Address, address => address.event, { nullable: true })
  @JoinColumn({ name: 'address_id' })
  address: Address;
}
export { Event };
