import { celebrate, Joi, Segments } from 'celebrate';
import { Router } from 'express';
import { container } from 'tsyringe';
import { PaymentController } from '../controllers/payment.controller';

const paymentRouter = Router();
const paymentController = container.resolve(PaymentController);

paymentRouter.post(
  '/pix',
  celebrate({
    [Segments.BODY]: Joi.object({
      amount: Joi.number().integer().positive().required(),
    }).required(),
  }),
  paymentController.createPix,
);

export default paymentRouter;
