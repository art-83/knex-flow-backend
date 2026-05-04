import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { CreateActivityService } from '../../../services/organizations/create-activitity.service';
import { FindActivitiesService } from '../../../../events/services/activities/find-activities.service';
import { UpdateActivityService } from '../../../../events/services/activities/update-activity.service';
import { DeleteActivityService } from '../../../../events/services/activities/delete-activity.service';

class OrganizationController {
  public async findActivities(request: Request, response: Response) {
    const findActivitiesService = container.resolve(FindActivitiesService);
    const activities = await findActivitiesService.execute(request.user_id, request.query);
    return response.json(activities);
  }

  public async createActivity(request: Request, response: Response) {
    const createActivityService = container.resolve(CreateActivityService);
    const organization_id = String(request.params.organization_id);

    const activity = await createActivityService.execute(request.user_id, organization_id, request.body);

    return response.status(201).json(activity);
  }

  public async updateActivity(request: Request, response: Response) {
    const updateActivityService = container.resolve(UpdateActivityService);
    const activity_id = String(request.params.activity_id);
    const activity = await updateActivityService.execute(request.user_id, activity_id, request.body);
    return response.json(activity);
  }

  public async deleteActivity(request: Request, response: Response) {
    const deleteActivityService = container.resolve(DeleteActivityService);
    const activity_id = String(request.params.activity_id);
    const activity = await deleteActivityService.execute(request.user_id, activity_id);
    return response.json(activity);
  }
}

export default OrganizationController;
