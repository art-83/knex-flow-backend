import { injectable } from 'tsyringe';
import PermissionDescriptionEnum from '../../../../modules/users/enums/permission-description.enum';
import EnsureUserOrganizationAccessService from './ensure-user-organization-access.service';
import EnsureUserHasPermissionService from './ensure-user-has-permission.service';

@injectable()
class EnsureUserCanActOnOrganizationService {
  constructor(
    private ensureUserOrganizationAccessService: EnsureUserOrganizationAccessService,
    private ensureUserHasPermissionService: EnsureUserHasPermissionService,
  ) {}

  public async execute(
    user_id: string,
    organization_id: string,
    requiredPermission: PermissionDescriptionEnum,
  ): Promise<void> {
    await this.ensureUserOrganizationAccessService.execute(user_id, organization_id);
    await this.ensureUserHasPermissionService.execute(user_id, organization_id, requiredPermission);
  }
}

export default EnsureUserCanActOnOrganizationService;
