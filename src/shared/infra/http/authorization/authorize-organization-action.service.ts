import { injectable } from 'tsyringe';
import { PermissionDescriptionEnum } from '../../../../modules/users/infra/orm/enums/permission-description.enum';
import { EnsureUserCanActOnOrganizationService } from './ensure-user-can-act-on-organization.service';
import { EnsureUserHasPermissionService } from './ensure-user-has-permission.service';
import { EnsureUserOrganizationAccessService } from './ensure-user-organization-access.service';

@injectable()
class AuthorizeOrganizationActionService {
  constructor(
    private ensureUserOrganizationAccessService: EnsureUserOrganizationAccessService,
    private ensureUserHasPermissionService: EnsureUserHasPermissionService,
    private ensureUserCanActOnOrganizationService: EnsureUserCanActOnOrganizationService,
  ) {}

  public async ensureUserBelongsToOrganization(userId: string, organizationId: string): Promise<void> {
    await this.ensureUserOrganizationAccessService.execute(userId, organizationId, 'subject');
  }

  public async ensureUserHasPermission(
    userId: string,
    organizationId: string,
    permission: PermissionDescriptionEnum,
  ): Promise<void> {
    await this.ensureUserHasPermissionService.execute(userId, organizationId, permission);
  }

  public async authorize(
    actorUserId: string,
    organizationId: string,
    requiredPermission: PermissionDescriptionEnum,
  ): Promise<void> {
    await this.ensureUserCanActOnOrganizationService.execute(actorUserId, organizationId, requiredPermission);
  }
}
export { AuthorizeOrganizationActionService };
