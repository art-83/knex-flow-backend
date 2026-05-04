import { Router } from 'express';
import { celebrate, Joi, Segments } from 'celebrate';
import OrganizationRolePermissionController from '../controllers/organization-role-permission.controller';

const organizationRolePermissionRouter = Router();
const organizationRolePermissionController = new OrganizationRolePermissionController();

organizationRolePermissionRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: Joi.object({
      organization_id: Joi.string().uuid().required(),
      organization_role_id: Joi.string().uuid().required(),
      permission_id: Joi.string().uuid().required(),
    }).required(),
  }),
  (request, response) => organizationRolePermissionController.create(request, response),
);

organizationRolePermissionRouter.get(
  '/',
  celebrate({
    [Segments.QUERY]: Joi.object({
      organization_id: Joi.string().uuid().required(),
      id: Joi.string().uuid(),
      organization_role_id: Joi.string().uuid(),
      permission_id: Joi.string().uuid(),
      limit: Joi.number().integer().min(1),
      offset: Joi.number().integer().min(0),
    }),
  }),
  (request, response) => organizationRolePermissionController.find(request, response),
);

organizationRolePermissionRouter.patch(
  '/:id',
  celebrate({
    [Segments.PARAMS]: Joi.object({
      id: Joi.string().uuid().required(),
    }),
    [Segments.BODY]: Joi.object({
      organization_id: Joi.string().uuid().required(),
      organization_role_id: Joi.string().uuid().required(),
      permission_id: Joi.string().uuid().required(),
    }).required(),
  }),
  (request, response) => organizationRolePermissionController.update(request, response),
);

organizationRolePermissionRouter.delete(
  '/:id',
  celebrate({
    [Segments.PARAMS]: Joi.object({
      id: Joi.string().uuid().required(),
    }),
    [Segments.QUERY]: Joi.object({
      organization_id: Joi.string().uuid().required(),
    }),
  }),
  (request, response) => organizationRolePermissionController.delete(request, response),
);

export default organizationRolePermissionRouter;
