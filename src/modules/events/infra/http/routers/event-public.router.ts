import { celebrate, Joi, Segments } from 'celebrate';
import { Router } from 'express';
import { EventPublicController } from '../controllers/event-public.controller';
import { defaultQueryOptionsSchema } from '../../../../../shared/infra/http/dtos/query-options-schema.dto';

const eventPublicRouter = Router();
const eventPublicController = new EventPublicController();

eventPublicRouter.get(
  '/',
  celebrate({
    [Segments.QUERY]: Joi.object({
      organization_id: Joi.string().uuid().optional(),
      ...defaultQueryOptionsSchema,
    }),
  }),
  eventPublicController.findEvents,
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
