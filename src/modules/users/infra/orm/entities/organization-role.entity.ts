import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { SequentialGeneratedUUID } from '../../../../../shared/infra/orm/entities/sequential-generated-uuid.entity';
import { Organization } from './organization.entity';
import { OrganizationRolePermission } from './organization-role-permission.entity';

@Entity('organization_roles')
@Unique(['organization', 'name'])
export class OrganizationRole extends SequentialGeneratedUUID {
  @Column()
  name: string;

  @Column()
  description: string;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;

  @DeleteDateColumn({ type: 'timestamptz' })
  deleted_at: Date;

  @ManyToOne(() => Organization, organization => organization.organizationRoles)
  @JoinColumn({ name: 'organization_id' })
  organization: Organization;

  @OneToMany(
    () => OrganizationRolePermission,
    organizationRolePermission => organizationRolePermission.organizationRole,
  )
  organizationRolePermissions: OrganizationRolePermission[];
}

export default OrganizationRole;
