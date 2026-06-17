import { Column, CreateDateColumn, DeleteDateColumn, Entity, OneToMany, UpdateDateColumn } from 'typeorm';
import { SequentialGeneratedUUID } from '../../../../../shared/infra/orm/entities/sequential-generated-uuid.entity';
import { OrganizationRole } from './organization-role.entity';
import { UserOrganization } from './user-organization.entity';
import { UserPermission } from './user-permission.entity';
import { Event } from '../../../../events/infra/orm/entities/event.entity';
import { Activity } from '../../../../events/infra/orm/entities/activity.entity';

@Entity('organizations')
export class Organization extends SequentialGeneratedUUID {
  @Column()
  name: string;

  @Column({ type: 'jsonb', nullable: true })
  configuration: Record<string, any>;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;

  @DeleteDateColumn({ type: 'timestamptz' })
  deleted_at: Date;

  @OneToMany(() => OrganizationRole, organizationRole => organizationRole.organization)
  organizationRoles: OrganizationRole[];

  @OneToMany(() => UserOrganization, userOrganization => userOrganization.organization)
  userOrganizations: UserOrganization[];

  @OneToMany(() => UserPermission, userPermission => userPermission.organization)
  userPermissions: UserPermission[];

  @OneToMany(() => Event, event => event.organization)
  events: Event[];

  @OneToMany(() => Activity, activity => activity.organization)
  activities: Activity[];
}

export default Organization;
