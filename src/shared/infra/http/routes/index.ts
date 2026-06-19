import { Router } from 'express';

import { authMiddleware } from '../middlewares/auth.middleware';
import { globalErrorHandlerMiddleware } from '../middlewares/global-error-handler.middleware';
import { authPublicRouter } from '../../../../modules/users/infra/http/routers/auth-public.router';
import { checkoutHooksRouter } from '../../../../modules/payments/infra/http/hooks/abacate-pay.hooks';
import { paymentRouter } from '../../../../modules/payments/infra/http/routers/payment.router';
import { eventRouter } from '../../../../modules/events/infra/http/routers/event.router';
import { orderRouter } from '../../../../modules/events/infra/http/routers/order.router';
import { authorizationRouter } from '../../../../modules/users/infra/http/routers/authorization.router';
import { organizationRouter } from '../../../../modules/users/infra/http/routers/organization.router';
import { fileRouter } from '../../../../modules/files/infra/http/routers/file.router';
import { eventPublicRouter } from '../../../../modules/events/infra/http/routers/event-public.router';

const routes = Router();

routes.use('/auth', authPublicRouter);
routes.use('/public/events', eventPublicRouter);

// Webhook externo: autenticado via header AbacatePay, não via JWT.
routes.use('/webhook/', checkoutHooksRouter);

routes.use(authMiddleware);

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

routes.use('/orders', orderRouter);
routes.use('/events', eventRouter);
routes.use('/organizations', organizationRouter);
routes.use('/users', authorizationRouter);
routes.use('/files', fileRouter);
routes.use('/payment', paymentRouter);
routes.use('/payments', paymentRouter);

routes.use(globalErrorHandlerMiddleware);
export { routes };
