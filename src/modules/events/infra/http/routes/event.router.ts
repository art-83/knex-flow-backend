import { celebrate, Joi, Segments } from 'celebrate';
import { Router } from 'express';
import EventController from '../controllers/event.controller';
import { OrderStatus } from '../../orm/enums/order-status.enum';
import {
  defaultQueryOptionsSchema,
  timestampQueryOptionsSchema,
} from '../../../../../shared/infra/http/dtos/query-options-schema.dto';

const eventRouter = Router();
const eventController = new EventController();

eventRouter.get(
  '/',
  celebrate({
    [Segments.QUERY]: {
      id: Joi.string().uuid().optional(),
      name: Joi.string().optional(),
      description: Joi.string().optional(),
      organization_id: Joi.string().uuid().optional(),
      ...timestampQueryOptionsSchema,
      ...defaultQueryOptionsSchema,
    },
  }),
  eventController.findEvents,
);

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

eventRouter.get(
  '/batches',
  celebrate({
    [Segments.QUERY]: {
      id: Joi.string().uuid().optional(),
      base_quantity: Joi.number().integer().min(1).optional(),
      price: Joi.number().positive().optional(),
      event_id: Joi.string().uuid().optional(),
      ...timestampQueryOptionsSchema,
      ...defaultQueryOptionsSchema,
    },
  }),
  eventController.findBatches,
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

eventRouter.patch(
  '/batches/:batch_id',
  celebrate({
    [Segments.PARAMS]: {
      batch_id: Joi.string().uuid().required(),
    },
    [Segments.BODY]: {
      event_id: Joi.string().uuid().optional(),
      base_quantity: Joi.number().integer().min(1).optional(),
      price: Joi.number().positive().optional(),
    },
  }),
  eventController.updateBatch,
);

eventRouter.delete(
  '/batches/:batch_id',
  celebrate({
    [Segments.PARAMS]: {
      batch_id: Joi.string().uuid().required(),
    },
  }),
  eventController.deleteBatch,
);

eventRouter.get(
  '/event-activities',
  celebrate({
    [Segments.QUERY]: {
      id: Joi.string().uuid().optional(),
      event_id: Joi.string().uuid().optional(),
      activity_id: Joi.string().uuid().optional(),
      hours_to_retrieve: Joi.number().integer().min(0).optional(),
      max_participants: Joi.number().integer().min(1).optional(),
      ...timestampQueryOptionsSchema,
      ...defaultQueryOptionsSchema,
    },
  }),
  eventController.findEventActivities,
);

eventRouter.patch(
  '/event-activities/:event_activity_id',
  celebrate({
    [Segments.PARAMS]: {
      event_activity_id: Joi.string().uuid().required(),
    },
    [Segments.BODY]: {
      event_id: Joi.string().uuid().optional(),
      activity_id: Joi.string().uuid().optional(),
      hours_to_retrieve: Joi.number().integer().min(0).optional(),
      max_participants: Joi.number().integer().min(1).optional(),
      start_date: Joi.date().optional(),
      end_date: Joi.date().optional(),
    },
  }),
  eventController.updateEventActivity,
);

eventRouter.delete(
  '/event-activities/:event_activity_id',
  celebrate({
    [Segments.PARAMS]: {
      event_activity_id: Joi.string().uuid().required(),
    },
  }),
  eventController.deleteEventActivity,
);

eventRouter.get(
  '/event-configurations',
  celebrate({
    [Segments.QUERY]: {
      id: Joi.string().uuid().optional(),
      event_id: Joi.string().uuid().optional(),
      ...timestampQueryOptionsSchema,
      ...defaultQueryOptionsSchema,
    },
  }),
  eventController.findEventConfigurations,
);

eventRouter.patch(
  '/event-configurations/:event_configuration_id',
  celebrate({
    [Segments.PARAMS]: {
      event_configuration_id: Joi.string().uuid().required(),
    },
    [Segments.BODY]: {
      event_id: Joi.string().uuid().optional(),
      configuration: Joi.object().allow(null).optional(),
    },
  }),
  eventController.updateEventConfiguration,
);

eventRouter.delete(
  '/event-configurations/:event_configuration_id',
  celebrate({
    [Segments.PARAMS]: {
      event_configuration_id: Joi.string().uuid().required(),
    },
  }),
  eventController.deleteEventConfiguration,
);

eventRouter.get(
  '/orders',
  celebrate({
    [Segments.QUERY]: {
      id: Joi.string().uuid().optional(),
      total_amount: Joi.number().positive().optional(),
      user_id: Joi.string().uuid().optional(),
      status: Joi.string()
        .valid(...Object.values(OrderStatus))
        .optional(),
      ...timestampQueryOptionsSchema,
      ...defaultQueryOptionsSchema,
    },
  }),
  eventController.findOrders,
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

eventRouter.patch(
  '/:event_id',
  celebrate({
    [Segments.PARAMS]: {
      event_id: Joi.string().uuid().required(),
    },
    [Segments.BODY]: {
      name: Joi.string().optional(),
      description: Joi.string().optional(),
      organization_id: Joi.string().uuid().optional(),
      start_date: Joi.date().optional(),
      end_date: Joi.date().optional(),
    },
  }),
  eventController.updateEvent,
);

eventRouter.delete(
  '/:event_id',
  celebrate({
    [Segments.PARAMS]: {
      event_id: Joi.string().uuid().required(),
    },
  }),
  eventController.deleteEvent,
);

export default eventRouter;
