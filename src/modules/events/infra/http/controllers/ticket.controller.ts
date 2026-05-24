import { Request, Response } from 'express';
import { container } from 'tsyringe';

import GetTicketsAvaliabilityAndMaybeCreateOrderService from '../../../services/tickets/find-tickets-avaliability-and-maybe-create-order.service';

class TicketController {
  public async getTicketsAvaliabilityAndMaybeCreateOrder(request: Request, response: Response) {
    const service = container.resolve(GetTicketsAvaliabilityAndMaybeCreateOrderService);
    const result = await service.execute(request.user_id, String(request.body.event_id));

    return response.json(result);
  }
}

export default TicketController;
