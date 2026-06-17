import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntitySequentialGeneratedUUID } from '../../../../../shared/infra/orm/entities/base-entity-sequential-generated-uuid.entity';
import { EventActivity } from './event-activity.entity';
import { Organization } from '../../../../users/infra/orm/entities/organization.entity';

@Entity({ name: 'activities' })
class Activity extends BaseEntitySequentialGeneratedUUID {
  @Column()
  name: string;

  @Column({ type: 'text' })
  description: string;

  @ManyToOne(() => Organization, organization => organization.activities, { nullable: false })
  @JoinColumn({ name: 'organization_id' })
  organization: Organization;

  @OneToMany(() => EventActivity, ea => ea.activity)
  event_activities: EventActivity[];
}
export { Activity };
