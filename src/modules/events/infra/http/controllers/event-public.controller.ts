import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { FindPublicEventsService } from '../../../services/events/find-public-events.service';

class EventPublicController {
  public async findEvents(request: Request, response: Response) {
    const findPublicEventsService = container.resolve(FindPublicEventsService);
    const events = await findPublicEventsService.execute(request.query);
    return response.json(events);
  }

  public async findEventById(request: Request, response: Response) {
    const findPublicEventsService = container.resolve(FindPublicEventsService);
    const event_id = String(request.params.event_id);
    const event = await findPublicEventsService.execute({ id: event_id });
    return response.json(event);
  }
}
export { EventPublicController };
