import { celebrate, Joi, Segments } from 'celebrate';
import { Router } from 'express';

import TicketController from '../controllers/ticket.controller';

const ticketRouter = Router();
const ticketController = new TicketController();

ticketRouter.post(
  '/availability',
  celebrate({
    [Segments.BODY]: Joi.object({
      event_id: Joi.string().uuid().required(),
    }).required(),
  }),
  ticketController.getTicketsAvaliabilityAndMaybeCreateOrder,
);

export default ticketRouter;
