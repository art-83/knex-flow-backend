import { celebrate, Joi, Segments } from 'celebrate';
import { Router } from 'express';
import { EventController } from '../controllers/event.controller';
import { defaultQueryOptionsSchema } from '../../../../../shared/dtos/incoming/http/schemas/default-query-options.schema';
import { timestampQueryOptionsSchema } from '../../../../../shared/dtos/incoming/http/schemas/timestamp-query-options.schema';
import { EventModality } from '../../orm/enums/event-modality.enum';
import { EventStatus } from '../../orm/enums/event-status.enum';

const eventRouter = Router();
const eventController = new EventController();

const eventUrlPathSchema = Joi.string()
  .pattern(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
  .max(120)
  .optional()
  .allow(null);

const eventStatusFilterSchema = Joi.string()
  .valid(...Object.values(EventStatus))
  .optional();

const eventCreateStatusSchema = Joi.string()
  .valid(...Object.values(EventStatus))
  .optional()
  .default(EventStatus.DRAFT);

const eventAddressSchema = Joi.object({
  street: Joi.string().trim().min(1).required(),
  number: Joi.string().trim().min(1).required(),
  city: Joi.string().trim().min(1).required(),
  state: Joi.string().trim().length(2).required(),
  country: Joi.string().trim().min(1).required(),
  zip_code: Joi.string()
    .trim()
    .required()
    .custom((value, helpers) => {
      const digits = value.replace(/\D/g, '');

      if (digits.length !== 8) {
        return helpers.error('any.invalid');
      }

      return value;
    }),
});

eventRouter.get(
  '/',
  celebrate({
    [Segments.QUERY]: Joi.object({
      id: Joi.string().uuid().optional(),
      name: Joi.string().optional(),
      description: Joi.string().optional(),
      organization_id: Joi.string().uuid().required(),
      url_path: eventUrlPathSchema,
      status: eventStatusFilterSchema,
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
      url_path: eventUrlPathSchema,
      banner_file_id: Joi.string().uuid().allow(null).optional(),
      icon_file_id: Joi.string().uuid().allow(null).optional(),
      status: eventCreateStatusSchema,
      address: eventAddressSchema.optional(),
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
      name: Joi.string().optional(),
      hours_to_retrieve_enabled: Joi.boolean().optional(),
      max_participants: Joi.number().integer().min(1).allow(null).optional(),
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
      name: Joi.string().optional(),
      file_id: Joi.string().uuid().allow(null).optional(),
      hours_to_retrieve_enabled: Joi.boolean().optional(),
      max_participants: Joi.number().integer().min(1).allow(null).optional(),
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
      institution: Joi.string().optional().allow(null).default(null),
      profession: Joi.string().optional().allow(null).default(null),
      user_id: Joi.string().uuid().optional().allow(null).default(null),
      file_id: Joi.string().uuid().optional().allow(null).default(null),
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
      file_id: Joi.string().uuid().optional().allow(null),
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
      name: Joi.string().required(),
      hours_to_retrieve_enabled: Joi.boolean().optional(),
      max_participants: Joi.number().integer().min(1).allow(null).optional(),
      start_date: Joi.date().required(),
      end_date: Joi.date().required(),
    }).required(),
  }),
  eventController.createEventActivity,
);

eventRouter.get(
  '/:event_id/activity-enrollments',
  celebrate({
    [Segments.PARAMS]: Joi.object({
      event_id: Joi.string().uuid().required(),
    }).required(),
  }),
  eventController.findUserEventActivityEnrollments,
);

eventRouter.post(
  '/:event_id/publish',
  celebrate({
    [Segments.PARAMS]: Joi.object({
      event_id: Joi.string().uuid().required(),
    }).required(),
  }),
  eventController.publishEvent,
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
      modality: Joi.string()
        .valid(...Object.values(EventModality))
        .optional(),
      url_path: eventUrlPathSchema,
      banner_file_id: Joi.string().uuid().allow(null).optional(),
      icon_file_id: Joi.string().uuid().allow(null).optional(),
      status: eventStatusFilterSchema,
      address: eventAddressSchema.optional(),
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
