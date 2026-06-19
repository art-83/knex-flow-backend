import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { FindOrganizationService } from '../../../services/organizations/find-organization.service';
import { UpdateOrganizationService } from '../../../services/organizations/update-organization.service';

class OrganizationController {
  public async find(request: Request, response: Response) {
    const service = container.resolve(FindOrganizationService);
    const result = await service.execute(request.user_id, String(request.params.organization_id));
    return response.json(result);
  }

  public async update(request: Request, response: Response) {
    const service = container.resolve(UpdateOrganizationService);
    const result = await service.execute(request.user_id, String(request.params.organization_id), request.body);
    return response.json(result);
  }
}
export { OrganizationController };
