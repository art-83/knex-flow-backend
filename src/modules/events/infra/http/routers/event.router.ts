import { celebrate, Joi, Segments } from 'celebrate';
import { Router } from 'express';
import EventController from '../controllers/event.controller';

const eventRouter = Router();
const eventController = new EventController();

eventRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
      description: Joi.string().required(),
      organization_id: Joi.string().uuid().required(),
      start_date: Joi.date().required(),
      end_date: Joi.date().required(),
    },
  }),
  eventController.createEvent,
);

eventRouter.post(
  '/batches',
  celebrate({
    [Segments.BODY]: {
      event_id: Joi.string().uuid().required(),
      base_quantity: Joi.number().integer().min(1).required(),
      price: Joi.number().positive().required(),
    },
  }),
  eventController.createBatch,
);

eventRouter.post(
  '/activities',
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
      description: Joi.string().required(),
      organization_id: Joi.string().uuid().required(),
    },
  }),
  eventController.createActivity,
);

export default eventRouter;
