import { celebrate, Joi, Segments } from 'celebrate';
import { Router } from 'express';
import PaymentController from '../controllers/payment.controller';

const paymentRouter = Router();
const paymentController = new PaymentController();

paymentRouter.post(
  '/pix',
  celebrate({
    [Segments.BODY]: {
      amount: Joi.number().integer().positive().required(),
    },
  }),
  paymentController.createPix,
);

export default paymentRouter;
