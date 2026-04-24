import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { CreateActivityService } from '../../../services/organizations/create-activitity.service';

class OrganizationController {
  public async createActivity(request: Request, response: Response) {
    const createActivityService = container.resolve(CreateActivityService);
    const organization_id = String(request.params.organization_id);

    const activity = await createActivityService.execute(request.user_id, organization_id, request.body);

    return response.status(201).json(activity);
  }
}

export default OrganizationController;
