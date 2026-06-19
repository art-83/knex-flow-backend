import { celebrate, Joi, Segments } from 'celebrate';
import { Router } from 'express';
import { EventPublicController } from '../controllers/event-public.controller';
import { defaultQueryOptionsSchema } from '../../../../../shared/dtos/incoming/http/schemas/default-query-options.schema';

const eventPublicRouter = Router();
const eventPublicController = new EventPublicController();

eventPublicRouter.get(
  '/',
  celebrate({
    [Segments.QUERY]: Joi.object({
      organization_id: Joi.string().uuid().optional(),
      url_path: Joi.string()
        .pattern(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
        .max(120)
        .optional(),
      ...defaultQueryOptionsSchema,
    }),
  }),
  eventPublicController.findEvents,
);

eventPublicRouter.get(
  '/:event_id/availability',
  celebrate({
    [Segments.PARAMS]: Joi.object({
      event_id: Joi.string().uuid().required(),
    }),
  }),
  eventPublicController.findEventAvailability,
);

eventPublicRouter.get(
  '/:event_id',
  celebrate({
    [Segments.PARAMS]: Joi.object({
      event_id: Joi.string().uuid().required(),
    }),
  }),
  eventPublicController.findEventById,
);
export { eventPublicRouter };
