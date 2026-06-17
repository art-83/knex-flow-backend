import { celebrate, Joi, Segments } from 'celebrate';
import { Router } from 'express';
import { EventController } from '../controllers/event.controller';
import {
  defaultQueryOptionsSchema,
  timestampQueryOptionsSchema,
} from '../../../../../shared/infra/http/dtos/query-options-schema.dto';
import { EventModality } from '../../orm/enums/event-modality.enum';

const eventRouter = Router();
const eventController = new EventController();

eventRouter.get(
  '/',
  celebrate({
    [Segments.QUERY]: Joi.object({
      id: Joi.string().uuid().optional(),
      name: Joi.string().optional(),
      description: Joi.string().optional(),
      organization_id: Joi.string().uuid().required(),
      ...timestampQueryOptionsSchema,
      ...defaultQueryOptionsSchema,
    }),
  }),
  eventController.findEvents,
);

eventRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: Joi.object({
      name: Joi.string().required(),
      description: Joi.string().required(),
      organization_id: Joi.string().uuid().required(),
      start_date: Joi.date().required(),
      end_date: Joi.date().required(),
      modality: Joi.string()
        .valid(...Object.values(EventModality))
        .optional(),
      configuration: Joi.object().allow(null).optional(),
      address: Joi.object({
        street: Joi.string().required(),
        number: Joi.string().required(),
        city: Joi.string().required(),
        state: Joi.string().required(),
        country: Joi.string().required(),
        zip_code: Joi.string().required(),
      }).optional(),
    }).required(),
  }),
  eventController.createEvent,
);

eventRouter.post(
  '/batches',
  celebrate({
    [Segments.BODY]: Joi.object({
      event_id: Joi.string().uuid().required(),
      base_quantity: Joi.number().integer().min(1).required(),
      price: Joi.number().positive().required(),
    }).required(),
  }),
  eventController.createBatch,
);

eventRouter.patch(
  '/batches/:batch_id',
  celebrate({
    [Segments.PARAMS]: Joi.object({
      batch_id: Joi.string().uuid().required(),
    }).required(),
    [Segments.BODY]: Joi.object({
      base_quantity: Joi.number().integer().min(1).optional(),
      price: Joi.number().positive().optional(),
    })
      .min(1)
      .required(),
  }),
  eventController.updateBatch,
);

eventRouter.get(
  '/batches',
  celebrate({
    [Segments.QUERY]: Joi.object({
      id: Joi.string().uuid().optional(),
      base_quantity: Joi.number().integer().min(1).optional(),
      price: Joi.number().positive().optional(),
      event_id: Joi.string().uuid().required(),
      ...timestampQueryOptionsSchema,
      ...defaultQueryOptionsSchema,
    }),
  }),
  eventController.findBatches,
);

eventRouter.delete(
  '/batches/:batch_id',
  celebrate({
    [Segments.PARAMS]: Joi.object({
      batch_id: Joi.string().uuid().required(),
    }).required(),
  }),
  eventController.deleteBatch,
);

eventRouter.get(
  '/event-activities',
  celebrate({
    [Segments.QUERY]: Joi.object({
      id: Joi.string().uuid().optional(),
      event_id: Joi.string().uuid().required(),
      activity_id: Joi.string().uuid().optional(),
      hours_to_retrieve: Joi.number().integer().min(0).optional(),
      max_participants: Joi.number().integer().min(1).optional(),
      ...timestampQueryOptionsSchema,
      ...defaultQueryOptionsSchema,
    }),
  }),
  eventController.findEventActivities,
);

eventRouter.patch(
  '/event-activities/:event_activity_id',
  celebrate({
    [Segments.PARAMS]: Joi.object({
      event_activity_id: Joi.string().uuid().required(),
    }).required(),
    [Segments.BODY]: Joi.object({
      hours_to_retrieve: Joi.number().integer().min(0).optional(),
      max_participants: Joi.number().integer().min(1).optional(),
      start_date: Joi.date().optional(),
      end_date: Joi.date().optional(),
    })
      .min(1)
      .required(),
  }),
  eventController.updateEventActivity,
);

eventRouter.delete(
  '/event-activities/:event_activity_id',
  celebrate({
    [Segments.PARAMS]: Joi.object({
      event_activity_id: Joi.string().uuid().required(),
    }).required(),
  }),
  eventController.deleteEventActivity,
);

eventRouter.post(
  '/event-activities/:event_activity_id/invited',
  celebrate({
    [Segments.PARAMS]: Joi.object({
      event_activity_id: Joi.string().uuid().required(),
    }).required(),
    [Segments.BODY]: Joi.object({
      name: Joi.string().required(),
      institution: Joi.string().optional(),
      profession: Joi.string().optional(),
      user_id: Joi.string().uuid().optional(),
    }).required(),
  }),
  eventController.createEventInvited,
);

eventRouter.get(
  '/event-activities/:event_activity_id/invited',
  celebrate({
    [Segments.PARAMS]: Joi.object({
      event_activity_id: Joi.string().uuid().required(),
    }).required(),
  }),
  eventController.findEventInvitedByEventActivity,
);

eventRouter.get(
  '/event-activities/:event_activity_id/presence/qr-code',
  celebrate({
    [Segments.PARAMS]: Joi.object({
      event_activity_id: Joi.string().uuid().required(),
    }).required(),
  }),
  eventController.generatePresenceQRCode,
);

eventRouter.post(
  '/event-activities/:event_activity_id/presence/validate',
  celebrate({
    [Segments.PARAMS]: Joi.object({
      event_activity_id: Joi.string().uuid().required(),
    }).required(),
    [Segments.BODY]: Joi.object({
      qr_code: Joi.string().required(),
    }).required(),
  }),
  eventController.validatePresenceQRCode,
);

eventRouter.patch(
  '/event-activities/:event_activity_id/invited/:invited_id',
  celebrate({
    [Segments.PARAMS]: Joi.object({
      event_activity_id: Joi.string().uuid().required(),
      invited_id: Joi.string().uuid().required(),
    }).required(),
    [Segments.BODY]: Joi.object({
      name: Joi.string().optional(),
      institution: Joi.string().optional().allow(null),
      profession: Joi.string().optional().allow(null),
      user_id: Joi.string().uuid().optional().allow(null),
    })
      .min(1)
      .required(),
  }),
  eventController.updateEventInvited,
);

eventRouter.get(
  '/invited/:invited_id',
  celebrate({
    [Segments.PARAMS]: Joi.object({
      invited_id: Joi.string().uuid().required(),
    }).required(),
  }),
  eventController.findEventInvitedById,
);

eventRouter.delete(
  '/invited/:invited_id',
  celebrate({
    [Segments.PARAMS]: Joi.object({
      invited_id: Joi.string().uuid().required(),
    }).required(),
  }),
  eventController.deleteEventInvited,
);

eventRouter.get(
  '/event-configurations',
  celebrate({
    [Segments.QUERY]: Joi.object({
      event_id: Joi.string().uuid().required(),
    }),
  }),
  eventController.findEventConfigurations,
);

eventRouter.patch(
  '/:event_id/configuration',
  celebrate({
    [Segments.PARAMS]: Joi.object({
      event_id: Joi.string().uuid().required(),
    }).required(),
    [Segments.BODY]: Joi.object({
      configuration: Joi.object().allow(null).required(),
    }).required(),
  }),
  eventController.updateEventConfiguration,
);

eventRouter.delete(
  '/:event_id/configuration',
  celebrate({
    [Segments.PARAMS]: Joi.object({
      event_id: Joi.string().uuid().required(),
    }).required(),
  }),
  eventController.deleteEventConfiguration,
);

eventRouter.get(
  '/:event_id/invited',
  celebrate({
    [Segments.PARAMS]: Joi.object({
      event_id: Joi.string().uuid().required(),
    }).required(),
  }),
  eventController.findEventInvited,
);

eventRouter.post(
  '/:event_id/activity',
  celebrate({
    [Segments.PARAMS]: Joi.object({
      event_id: Joi.string().uuid().required(),
    }).required(),
    [Segments.BODY]: Joi.object({
      activity_id: Joi.string().uuid().required(),
      hours_to_retrieve: Joi.number().integer().min(0).required(),
      max_participants: Joi.number().integer().min(1).required(),
      start_date: Joi.date().required(),
      end_date: Joi.date().required(),
    }).required(),
  }),
  eventController.createEventActivity,
);

eventRouter.patch(
  '/:event_id',
  celebrate({
    [Segments.PARAMS]: Joi.object({
      event_id: Joi.string().uuid().required(),
    }).required(),
    [Segments.BODY]: Joi.object({
      name: Joi.string().optional(),
      description: Joi.string().optional(),
      start_date: Joi.date().optional(),
      end_date: Joi.date().optional(),
      configuration: Joi.object().allow(null).optional(),
    })
      .min(1)
      .required(),
  }),
  eventController.updateEvent,
);

eventRouter.delete(
  '/:event_id',
  celebrate({
    [Segments.PARAMS]: Joi.object({
      event_id: Joi.string().uuid().required(),
    }).required(),
  }),
  eventController.deleteEvent,
);
export { eventRouter };
