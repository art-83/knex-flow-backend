import { Column, Entity, JoinColumn, ManyToOne, OneToMany, Unique } from 'typeorm';
import { BaseEntitySequentialGeneratedUUID } from '../../../../../shared/infra/orm/entities/base-entity-sequential-generated-uuid.entity';
import { Organization } from './organization.entity';
import { OrganizationRolePermission } from './organization-role-permission.entity';

@Entity('organization_roles')
@Unique(['organization', 'name'])
class OrganizationRole extends BaseEntitySequentialGeneratedUUID {
  @Column()
  name: string;

  @Column()
  description: string;

  @ManyToOne(() => Organization, organization => organization.organization_roles)
  @JoinColumn({ name: 'organization_id' })
  organization: Organization;

  @OneToMany(
    () => OrganizationRolePermission,
    organizationRolePermission => organizationRolePermission.organization_role,
  )
  organization_role_permissions: OrganizationRolePermission[];
}
export { OrganizationRole };
