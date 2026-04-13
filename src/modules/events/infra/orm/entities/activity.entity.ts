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
import { EventActivity } from './event-activity.entity';
import { Organization } from '../../../../users/infra/orm/entities/organization.entity';

@Entity({ name: 'activities' })
export class Activity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'text' })
  description: string;

  @ManyToOne(() => Organization, organization => organization.activities, { nullable: false })
  @JoinColumn({ name: 'organization_id' })
  organization: Organization;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;

  @OneToMany(() => EventActivity, ea => ea.activity)
  event_activities: EventActivity[];
}

export default Activity;
