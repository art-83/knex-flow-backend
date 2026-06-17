import { celebrate, Joi, Segments } from 'celebrate';
import { Router } from 'express';
import { EventController } from '../controllers/event.controller';
import {
  defaultQueryOptionsSchema,
  timestampQueryOptionsSchema,
} from '../../../../../shared/infra/http/dtos/query-options-schema.dto';

const eventPublicRouter = Router();
const eventController = new EventController();

eventPublicRouter.get(
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
export { eventPublicRouter };
