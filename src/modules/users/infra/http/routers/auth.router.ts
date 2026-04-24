import { Router } from 'express';
import { celebrate, Joi, Segments } from 'celebrate';
import AuthController from '../controllers/auth.controller';

const authRouter = Router();
const authController = new AuthController();

authRouter.post(
  '/login',
  celebrate({
    [Segments.BODY]: Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().min(6).required(),
    }).required(),
  }),
  (request, response) => authController.login(request, response),
);

authRouter.post(
  '/register',
  celebrate({
    [Segments.BODY]: Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().min(6).required(),
    }).required(),
  }),
  (request, response) => authController.register(request, response),
);

authRouter.post(
  '/refresh',
  celebrate({
    [Segments.BODY]: Joi.object({
      refreshToken: Joi.string().required(),
    }).required(),
  }),
  (request, response) => authController.refresh(request, response),
);

export default authRouter;
