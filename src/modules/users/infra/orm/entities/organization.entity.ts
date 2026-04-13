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
import { Event } from '../../../../events/infra/orm/entities/event.entity';
import { Activity } from '../../../../events/infra/orm/entities/activity.entity';

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

  @OneToMany(() => Event, event => event.organization)
  events: Event[];

  @OneToMany(() => Activity, activity => activity.organization)
  activities: Activity[];
}

export default Organization;
