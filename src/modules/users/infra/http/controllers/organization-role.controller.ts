import { Request, Response } from 'express';
import { container } from 'tsyringe';
import CreateOrganizationRoleService from '../../../services/organization-roles/create-organization-role.service';
import FindOrganizationRolesService from '../../../services/organization-roles/find-organization-roles.service';
import UpdateOrganizationRoleService from '../../../services/organization-roles/update-organization-role.service';
import DeleteOrganizationRoleService from '../../../services/organization-roles/delete-organization-role.service';

class OrganizationRoleController {
  public async create(request: Request, response: Response) {
    const service = container.resolve(CreateOrganizationRoleService);
    const result = await service.execute(request.user_id, request.body);
    return response.status(201).json(result);
  }

  public async find(request: Request, response: Response) {
    const service = container.resolve(FindOrganizationRolesService);
    const result = await service.execute(request.user_id, request.query);
    return response.json(result);
  }

  public async update(request: Request, response: Response) {
    const service = container.resolve(UpdateOrganizationRoleService);
    const result = await service.execute(request.user_id, String(request.params.id), request.body);
    return response.json(result);
  }

  public async delete(request: Request, response: Response) {
    const service = container.resolve(DeleteOrganizationRoleService);
    const result = await service.execute(
      request.user_id,
      String(request.params.id),
      String(request.query.organization_id),
    );
    return response.json(result);
  }
}

export default OrganizationRoleController;
