import { Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntitySequentialGeneratedUUID } from '../../../../../shared/infra/orm/entities/base-entity-sequential-generated-uuid.entity';
import { User } from './user.entity';
import { Organization } from './organization.entity';

@Entity('user_organizations')
class UserOrganization extends BaseEntitySequentialGeneratedUUID {
  @ManyToOne(() => User, user => user.user_organizations)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Organization, organization => organization.user_organizations)
  @JoinColumn({ name: 'organization_id' })
  organization: Organization;
}
export { UserOrganization };
