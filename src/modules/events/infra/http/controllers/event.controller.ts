import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { CreateEventService } from '../../../services/events/create-event.service';
import { CreateBatchService } from '../../../services/batches/create-batch.service';
import { CreateActivityService } from '../../../services/activities/create-activity.service';

class EventController {
  public async createEvent(request: Request, response: Response) {
    const createEventService = container.resolve(CreateEventService);
    const event = await createEventService.execute(request.user_id, request.body);
    return response.status(201).json(event);
  }

  public async createBatch(request: Request, response: Response) {
    const createBatchService = container.resolve(CreateBatchService);
    const batch = await createBatchService.execute(request.user_id, request.body);
    return response.status(201).json(batch);
  }

  public async createActivity(request: Request, response: Response) {
    const createActivityService = container.resolve(CreateActivityService);
    const activity = await createActivityService.execute(request.user_id, request.body);
    return response.status(201).json(activity);
  }
}

export default EventController;
