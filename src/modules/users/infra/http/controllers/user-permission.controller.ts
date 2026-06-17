import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { CreateUserPermissionService } from '../../../services/user-permissions/create-user-permission.service';
import { FindUserPermissionsService } from '../../../services/user-permissions/find-user-permissions.service';
import { DeleteUserPermissionService } from '../../../services/user-permissions/delete-user-permission.service';

class UserPermissionController {
  public async create(request: Request, response: Response) {
    const service = container.resolve(CreateUserPermissionService);
    const result = await service.execute(request.user_id, request.body);
    return response.status(201).json(result);
  }

  public async find(request: Request, response: Response) {
    const service = container.resolve(FindUserPermissionsService);
    const result = await service.execute(request.user_id, request.query);
    return response.json(result);
  }

  public async delete(request: Request, response: Response) {
    const service = container.resolve(DeleteUserPermissionService);
    const result = await service.execute(
      request.user_id,
      String(request.params.id),
      String(request.query.organization_id || ''),
    );
    return response.json(result);
  }
}
export { UserPermissionController };
