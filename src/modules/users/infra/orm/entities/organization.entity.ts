import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { OrganizationRole } from './organization-role.entity';
import { UserOrganization } from './user-organization.entity';

@Entity('organizations')
export class Organization {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;

  @OneToMany(() => OrganizationRole, organizationRole => organizationRole.organization)
  organizationRoles: OrganizationRole[];

  @OneToMany(() => UserOrganization, userOrganization => userOrganization.organization)
  userOrganizations: UserOrganization[];

  // TODO: adicionar relacionamento @OneToMany com a entidade Event do módulo events (Organization -> 0..* Events)
  // events: Event[];

  // TODO: adicionar relacionamento @OneToMany com a entidade Activity do módulo events (Organization -> 1..* Activities)
  // activities: Activity[];
}

export default Organization;
