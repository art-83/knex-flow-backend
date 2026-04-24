import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { CreateEventService } from '../../../services/events/create-event.service';
import { CreateBatchService } from '../../../services/batches/create-batch.service';

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
}

export default EventController;
