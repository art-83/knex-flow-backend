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
import { Organization } from './organization.entity';
import { OrganizationRolePermission } from './organization-role-permission.entity';

@Entity('organization_roles')
export class OrganizationRole {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;

  @ManyToOne(() => Organization, organization => organization.organizationRoles)
  @JoinColumn({ name: 'organization_id' })
  organization: Organization;

  @OneToMany(() => OrganizationRolePermission, organizationRolePermission => organizationRolePermission.organizationRole)
  organizationRolePermissions: OrganizationRolePermission[];
}

export default OrganizationRole;
