import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { CreateOrganizationRolePermissionService } from '../../../services/organization-role-permissions/create-organization-role-permission.service';
import { FindOrganizationRolePermissionsService } from '../../../services/organization-role-permissions/find-organization-role-permissions.service';
import { DeleteOrganizationRolePermissionService } from '../../../services/organization-role-permissions/delete-organization-role-permission.service';

class OrganizationRolePermissionController {
  public async create(request: Request, response: Response) {
    const service = container.resolve(CreateOrganizationRolePermissionService);
    const result = await service.execute(request.user_id, request.body.organization_id, request.body);
    return response.status(201).json(result);
  }

  public async find(request: Request, response: Response) {
    const service = container.resolve(FindOrganizationRolePermissionsService);
    const result = await service.execute(request.user_id, request.query);
    return response.json(result);
  }

  public async delete(request: Request, response: Response) {
    const service = container.resolve(DeleteOrganizationRolePermissionService);
    const result = await service.execute(
      request.user_id,
      String(request.params.id),
      String(request.query.organization_id || ''),
    );
    return response.json(result);
  }
}
export { OrganizationRolePermissionController };
