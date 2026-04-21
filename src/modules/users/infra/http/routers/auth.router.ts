import { Router } from 'express';
import { celebrate, Joi, Segments } from 'celebrate';
import { container } from 'tsyringe';
import AuthController from '../controllers/auth.controller';

const authRouter = Router();
const authController = container.resolve(AuthController);

authRouter.post(
  '/login',
  celebrate({
    [Segments.BODY]: {
      email: Joi.string().email().required(),
      password: Joi.string().min(6).required(),
    },
  }),
  (request, response) => authController.login(request, response),
);

authRouter.post(
  '/refresh',
  celebrate({
    [Segments.BODY]: {
      refreshToken: Joi.string().required(),
    },
  }),
  (request, response) => authController.refresh(request, response),
);

export default authRouter;
