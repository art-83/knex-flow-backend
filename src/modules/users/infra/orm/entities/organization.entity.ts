import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntitySequentialGeneratedUUID } from '../../../../../shared/infra/orm/entities/base-entity-sequential-generated-uuid.entity';
import { OrganizationRole } from './organization-role.entity';
import { UserOrganization } from './user-organization.entity';
import { UserPermission } from './user-permission.entity';
import { Event } from '../../../../events/infra/orm/entities/event.entity';

@Entity('organizations')
class Organization extends BaseEntitySequentialGeneratedUUID {
  @Column()
  name: string;

  @Column({ type: 'jsonb', nullable: true })
  configuration: Record<string, any>;

  @OneToMany(() => OrganizationRole, organizationRole => organizationRole.organization)
  organization_roles: OrganizationRole[];

  @OneToMany(() => UserOrganization, userOrganization => userOrganization.organization)
  user_organizations: UserOrganization[];

  @OneToMany(() => UserPermission, userPermission => userPermission.organization)
  user_permissions: UserPermission[];

  @OneToMany(() => Event, event => event.organization)
  events: Event[];
}
export { Organization };
