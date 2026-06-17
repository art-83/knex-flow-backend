import { Router } from 'express';

import { authMiddleware } from '../middlewares/auth.middleware';
import { globalErrorHandlerMiddleware } from '../middlewares/global-error-handler.middleware';
import { authRouter } from '../../../../modules/users/infra/http/routers/auth.router';
import { organizationRouter } from '../../../../modules/users/infra/http/routers/organization.router';
import { checkoutHooksRouter } from '../../../../modules/payments/infra/http/hooks/abacate-pay.hooks';
import { paymentRouter } from '../../../../modules/payments/infra/http/routers/payment.router';
import { eventRouter } from '../../../../modules/events/infra/http/routers/event.router';
import { eventPublicRouter } from '../../../../modules/events/infra/http/routers/event-public.router';
import { orderRouter } from '../../../../modules/events/infra/http/routers/order.router';
import { authorizationRouter } from '../../../../modules/users/infra/http/routers/authorization.router';
import { fileRouter } from '../../../../modules/files/infra/http/routers/file.router';

const routes = Router();

routes.use('/health', (request, response) => {
  const lupeDeLupeSongs = [
    'Cabo Frio',
    'Gaúcha',
    'Fogo-Fátuo',
    'A Escrava Isaura',
    'Pavimento',
    '17',
    'Eu Já Venci',
    'Redenção (Três Gatos e um Cachorro)',
    'Dalila',
    'SP (Pais Solteiros)',
  ];
  const randomSong = lupeDeLupeSongs[Math.floor(Math.random() * lupeDeLupeSongs.length)];
  return response.status(200).json({ messagem: 'lula livre #lula2026', som_da_vez: `lupe de lupe - ${randomSong}` });
});

routes.use('/auth', authRouter);
routes.use('/webhook/', checkoutHooksRouter);
routes.use('/events', eventPublicRouter);

routes.use(authMiddleware);

routes.use('/orders', orderRouter);
routes.use('/events', eventRouter);
routes.use('/users', authorizationRouter);
routes.use('/organizations', organizationRouter);
routes.use('/files', fileRouter);

routes.use('/payment', paymentRouter);
routes.use('/payments', paymentRouter);

routes.use(globalErrorHandlerMiddleware);
export { routes };
