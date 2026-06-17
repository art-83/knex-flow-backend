import { Router } from 'express';
import { celebrate, Joi, Segments } from 'celebrate';
import { OrganizationController } from '../controllers/organization.controller';
import {
  defaultQueryOptionsSchema,
  timestampQueryOptionsSchema,
} from '../../../../../shared/infra/http/dtos/query-options-schema.dto';

const organizationRouter = Router();
const organizationController = new OrganizationController();

organizationRouter.get(
  '/activities',
  celebrate({
    [Segments.QUERY]: {
      id: Joi.string().uuid().optional(),
      name: Joi.string().optional(),
      description: Joi.string().optional(),
      organization_id: Joi.string().uuid().required(),
      ...timestampQueryOptionsSchema,
      ...defaultQueryOptionsSchema,
    },
  }),
  (request, response) => organizationController.findActivities(request, response),
);

organizationRouter.post(
  '/:organization_id/activities',
  celebrate({
    [Segments.PARAMS]: {
      organization_id: Joi.string().uuid().required(),
    },
    [Segments.BODY]: {
      name: Joi.string().required(),
      description: Joi.string().required(),
    },
  }),
  (request, response) => organizationController.createActivity(request, response),
);

organizationRouter.patch(
  '/activities/:activity_id',
  celebrate({
    [Segments.PARAMS]: {
      activity_id: Joi.string().uuid().required(),
    },
    [Segments.BODY]: {
      name: Joi.string().optional(),
      description: Joi.string().optional(),
    },
  }),
  (request, response) => organizationController.updateActivity(request, response),
);

organizationRouter.delete(
  '/activities/:activity_id',
  celebrate({
    [Segments.PARAMS]: {
      activity_id: Joi.string().uuid().required(),
    },
  }),
  (request, response) => organizationController.deleteActivity(request, response),
);
export { organizationRouter };
