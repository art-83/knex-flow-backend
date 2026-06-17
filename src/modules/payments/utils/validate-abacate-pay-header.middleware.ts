import { NextFunction, Request, Response } from 'express';

import { abacatepayConfig } from '../../../config/abacatepay.config';

function validateAbacatePayHeaderMiddleware(request: Request, response: Response, next: NextFunction): void {
  const webhookSecret = request.headers['x-webhook-secret'];

  if (!abacatepayConfig.webhookSecret || webhookSecret !== abacatepayConfig.webhookSecret) {
    response.status(401).json({ message: 'Unauthorized' });
    return;
  }

  next();
}
export { validateAbacatePayHeaderMiddleware };
