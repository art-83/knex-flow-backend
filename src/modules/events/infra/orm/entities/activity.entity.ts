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
import { EventActivity } from './event-activity.entity';
import { Organization } from '../../../../users/infra/orm/entities/organization.entity';

@Entity({ name: 'activities' })
export class Activity extends SequentialGeneratedUUID {
  @Column()
  name: string;

  @Column({ type: 'text' })
  description: string;

  @ManyToOne(() => Organization, organization => organization.activities, { nullable: false })
  @JoinColumn({ name: 'organization_id' })
  organization: Organization;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;

  @DeleteDateColumn({ type: 'timestamptz' })
  deleted_at: Date;

  @OneToMany(() => EventActivity, ea => ea.activity)
  event_activities: EventActivity[];
}

export default Activity;
