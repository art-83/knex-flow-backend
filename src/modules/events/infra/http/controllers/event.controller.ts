import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { CreateEventService } from '../../../services/events/create-event.service';
import { CreateBatchService } from '../../../services/batches/create-batch-and-tickets.service';
import { CreateEventActivityService } from '../../../services/activities/create-event-activity-and-event-activity-orders.service';

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

  public async createEventActivity(request: Request, response: Response) {
    const createEventActivityService = container.resolve(CreateEventActivityService);
    const event_id = String(request.params.event_id);
    const eventActivity = await createEventActivityService.execute(request.user_id, event_id, request.body);
    return response.status(201).json(eventActivity);
  }
}

export default EventController;
