import { Router } from 'express';
import { celebrate, Joi, Segments } from 'celebrate';
import { AuthController } from '../controllers/auth.controller';

const authPublicRouter = Router();
const authController = new AuthController();

authPublicRouter.post(
  '/login',
  celebrate({
    [Segments.BODY]: Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().min(6).required(),
    }).required(),
  }),
  (request, response) => authController.login(request, response),
);

authPublicRouter.post(
  '/register',
  celebrate({
    [Segments.BODY]: Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().min(6).required(),
    }).required(),
  }),
  (request, response) => authController.register(request, response),
);

authPublicRouter.post(
  '/refresh',
  celebrate({
    [Segments.BODY]: Joi.object({
      refreshToken: Joi.string().required(),
    }).required(),
  }),
  (request, response) => authController.refresh(request, response),
);
export { authPublicRouter };
