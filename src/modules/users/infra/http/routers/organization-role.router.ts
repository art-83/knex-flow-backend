import { Router } from 'express';
import { celebrate, Joi, Segments } from 'celebrate';
import OrganizationRoleController from '../controllers/organization-role.controller';

const organizationRoleRouter = Router();
const organizationRoleController = new OrganizationRoleController();

organizationRoleRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: Joi.object({
      organization_id: Joi.string().uuid().required(),
      name: Joi.string().required(),
      description: Joi.string().required(),
    }).required(),
  }),
  (request, response) => organizationRoleController.create(request, response),
);

organizationRoleRouter.get(
  '/',
  celebrate({
    [Segments.QUERY]: Joi.object({
      organization_id: Joi.string().uuid().required(),
      id: Joi.string().uuid(),
      name: Joi.string(),
      limit: Joi.number().integer().min(1),
      offset: Joi.number().integer().min(0),
    }),
  }),
  (request, response) => organizationRoleController.find(request, response),
);

organizationRoleRouter.patch(
  '/:id',
  celebrate({
    [Segments.PARAMS]: Joi.object({
      id: Joi.string().uuid().required(),
    }),
    [Segments.BODY]: Joi.object({
      organization_id: Joi.string().uuid().required(),
      name: Joi.string().required(),
      description: Joi.string().required(),
    }).required(),
  }),
  (request, response) => organizationRoleController.update(request, response),
);

organizationRoleRouter.delete(
  '/:id',
  celebrate({
    [Segments.PARAMS]: Joi.object({
      id: Joi.string().uuid().required(),
    }),
    [Segments.QUERY]: Joi.object({
      organization_id: Joi.string().uuid().required(),
    }),
  }),
  (request, response) => organizationRoleController.delete(request, response),
);

export default organizationRoleRouter;
