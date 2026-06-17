import { CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, UpdateDateColumn } from 'typeorm';
import { SequentialGeneratedUUID } from '../../../../../shared/infra/orm/entities/sequential-generated-uuid.entity';
import { User } from './user.entity';
import { Organization } from './organization.entity';

@Entity('user_organizations')
export class UserOrganization extends SequentialGeneratedUUID {
  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;

  @DeleteDateColumn({ type: 'timestamptz' })
  deleted_at: Date;

  @ManyToOne(() => User, user => user.userOrganizations)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Organization, organization => organization.userOrganizations)
  @JoinColumn({ name: 'organization_id' })
  organization: Organization;
}

export default UserOrganization;
