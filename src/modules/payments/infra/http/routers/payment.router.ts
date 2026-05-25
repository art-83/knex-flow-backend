import { celebrate, Joi, Segments } from 'celebrate';
import { Router } from 'express';
import { container } from 'tsyringe';
import { PaymentController } from '../controllers/payment.controller';

const paymentRouter = Router();
const paymentController = container.resolve(PaymentController);

paymentRouter.get(
  '/:id',
  celebrate({
    [Segments.PARAMS]: Joi.object({
      user_id: Joi.string().uuid().required(),
    }),
  }),
  paymentController.findUserPaymentById,
);

paymentRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: Joi.object({
      order_id: Joi.string().uuid().required(),
      method: Joi.string().valid('PIX', 'CREDIT', 'DEBIT').required(),
    }).required(),
  }),
  paymentController.create,
);

export default paymentRouter;
