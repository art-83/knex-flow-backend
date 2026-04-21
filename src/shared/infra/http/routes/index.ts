import { Router } from 'express';
import authRouter from '../../../../modules/users/infra/http/routers/auth.router';
import checkoutHooksRouter from '../../../../modules/payments/infra/http/hooks/checkout.hooks';
import paymentRouter from '../../../../modules/payments/infra/http/routers/payment.router';

const routes = Router();

routes.use('/health', (request, response) => {
  return response.status(200).json({ message: 'Strawberry fields forever!' });
});

routes.use('/auth', authRouter);

routes.use('/payment', paymentRouter);
routes.use('/webhooks/pix/checkout', checkoutHooksRouter);

export default routes;
