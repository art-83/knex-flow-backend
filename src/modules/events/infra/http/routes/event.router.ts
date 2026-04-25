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
  '/:event_id/activity',
  celebrate({
    [Segments.PARAMS]: {
      event_id: Joi.string().uuid().required(),
    },
    [Segments.BODY]: {
      activity_id: Joi.string().uuid().required(),
      hours_to_retrieve: Joi.number().integer().min(0).required(),
      max_participants: Joi.number().integer().min(1).required(),
      start_date: Joi.date().required(),
      end_date: Joi.date().required(),
    },
  }),
  eventController.createEventActivity,
);
export default eventRouter;
