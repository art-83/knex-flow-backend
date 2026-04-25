import { Router } from 'express';
import { celebrate, Joi, Segments } from 'celebrate';
import UserPermissionController from '../controllers/user-permission.controller';

const userPermissionRouter = Router();
const userPermissionController = new UserPermissionController();

userPermissionRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: Joi.object({
      user_id: Joi.string().uuid().required(),
      organization_id: Joi.string().uuid().required(),
      permission_id: Joi.string().uuid().required(),
    }).required(),
  }),
  (request, response) => userPermissionController.create(request, response),
);

userPermissionRouter.get(
  '/',
  celebrate({
    [Segments.QUERY]: Joi.object({
      organization_id: Joi.string().uuid().required(),
      id: Joi.string().uuid(),
      user_id: Joi.string().uuid(),
      permission_id: Joi.string().uuid(),
      limit: Joi.number().integer().min(1),
      offset: Joi.number().integer().min(0),
    }),
  }),
  (request, response) => userPermissionController.find(request, response),
);

userPermissionRouter.patch(
  '/:id',
  celebrate({
    [Segments.PARAMS]: Joi.object({
      id: Joi.string().uuid().required(),
    }),
    [Segments.BODY]: Joi.object({
      user_id: Joi.string().uuid().required(),
      organization_id: Joi.string().uuid().required(),
      permission_id: Joi.string().uuid().required(),
    }).required(),
  }),
  (request, response) => userPermissionController.update(request, response),
);

userPermissionRouter.delete(
  '/:id',
  celebrate({
    [Segments.PARAMS]: Joi.object({
      id: Joi.string().uuid().required(),
    }),
    [Segments.QUERY]: Joi.object({
      organization_id: Joi.string().uuid().required(),
    }),
  }),
  (request, response) => userPermissionController.delete(request, response),
);

export default userPermissionRouter;
