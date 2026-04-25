import { Request, Response } from 'express';
import { container } from 'tsyringe';
import OrganizationRoleCrudService from '../../../services/organization-roles/organization-role-crud.service';

class OrganizationRoleController {
  public async create(request: Request, response: Response) {
    const service = container.resolve(OrganizationRoleCrudService);
    const result = await service.create(request.user_id, request.body);
    return response.status(201).json(result);
  }

  public async find(request: Request, response: Response) {
    const service = container.resolve(OrganizationRoleCrudService);
    const result = await service.find(request.user_id, request.query);
    return response.json(result);
  }

  public async update(request: Request, response: Response) {
    const service = container.resolve(OrganizationRoleCrudService);
    const result = await service.update(request.user_id, String(request.params.id), request.body);
    return response.json(result);
  }

  public async delete(request: Request, response: Response) {
    const service = container.resolve(OrganizationRoleCrudService);
    const result = await service.delete(
      request.user_id,
      String(request.params.id),
      String(request.query.organization_id || ''),
    );
    return response.json(result);
  }
}

export default OrganizationRoleController;
