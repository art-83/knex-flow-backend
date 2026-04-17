import { Router } from 'express';
import { celebrate, Joi, Segments } from 'celebrate';
import AuthController from '../controllers/auth.controller';

const authRouter = Router();
const authController = new AuthController();

authRouter.post(
  '/login',
  celebrate({
    [Segments.BODY]: {
      email: Joi.string().email().required(),
      password: Joi.string().min(6).required(),
    },
  }),
  authController.login,
);

authRouter.post(
  '/refresh',
  celebrate({
    [Segments.BODY]: {
      refreshToken: Joi.string().required(),
    },
  }),
  authController.refresh,
);

export default authRouter;
