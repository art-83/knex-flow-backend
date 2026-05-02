import { Router } from 'express';
import { celebrate, Joi, Segments } from 'celebrate';
import OrganizationRolePermissionController from '../controllers/organization-role-permission.controller';
import { ensureOrganizationRolePermissionAccess } from '../middlewares/ensure-organization-role-permission-access.middleware';
import PermissionDescriptionEnum from '../../../enums/permission-description.enum';

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
  ensureOrganizationRolePermissionAccess(PermissionDescriptionEnum.ORGANIZATION_ROLE_PERMISSION_CREATE),
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
  ensureOrganizationRolePermissionAccess(PermissionDescriptionEnum.ORGANIZATION_ROLE_PERMISSION_READ),
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
  ensureOrganizationRolePermissionAccess(PermissionDescriptionEnum.ORGANIZATION_ROLE_PERMISSION_UPDATE),
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
  ensureOrganizationRolePermissionAccess(PermissionDescriptionEnum.ORGANIZATION_ROLE_PERMISSION_DELETE),
  (request, response) => organizationRolePermissionController.delete(request, response),
);

export default organizationRolePermissionRouter;
