import { Request, Response, NextFunction } from 'express';
import { container } from 'tsyringe';
import AppError from '../../../../../shared/infra/http/errors/app-error';
import EnsureUserOrganizationAccessService from '../../../services/authorization/ensure-user-organization-access.service';
import EnsureUserHasPermissionService from '../../../services/authorization/ensure-user-has-permission.service';
import PermissionDescriptionEnum from '../../../enums/permission-description.enum';

export function ensureOrganizationRolePermissionAccess(permission: PermissionDescriptionEnum) {
  return async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    try {
      const organization_id = (request.body.organization_id || request.query.organization_id) as string;

      if (!organization_id) {
        response.status(400).json({ error: 'organization_id is required' });
        return;
      }

      const ensureUserOrganizationAccessService = container.resolve(EnsureUserOrganizationAccessService);
      const ensureUserHasPermissionService = container.resolve(EnsureUserHasPermissionService);

      await ensureUserOrganizationAccessService.execute(request.user_id, organization_id);
      await ensureUserHasPermissionService.execute(request.user_id, organization_id, permission);

      next();
    } catch (error) {
      if (error instanceof AppError) {
        response.status(error.code).json({ error: error.message });
        return;
      }

      response.status(500).json({ error: 'Internal server error' });
    }
  };
}
