import { Router } from 'express';
import { celebrate, Joi, Segments } from 'celebrate';
import { UsersController } from '../controllers/users.controller';

const usersRouter = Router();
const usersController = new UsersController();

usersRouter.get(
  '/',
  celebrate({
    [Segments.QUERY]: Joi.object({
      organization_id: Joi.string().uuid().required(),
    }),
  }),
  (request, response) => usersController.find(request, response),
);

usersRouter.get('/permissions', (request, response) => usersController.findPermissions(request, response));

usersRouter.get('/me', (request, response) => usersController.me(request, response));
export { usersRouter };
