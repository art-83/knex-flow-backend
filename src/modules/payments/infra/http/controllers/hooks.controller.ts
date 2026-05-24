import { Request, Response } from 'express';

import AbacatepayWebhookHandlerService from '../../../services/abacatepay-webhook-handler.service';
import { container } from 'tsyringe';

export class HooksController {
  public async onAbacatepay(request: Request, response: Response): Promise<Response> {
    console.log('[abacatepay] request', request);
    console.log('[abacatepay] headers', request.headers);
    console.log('[abacatepay] body', request.body);
    console.log('[abacatepay] query', request.query);
    console.log('[abacatepay] params', request.params);

    const abacatepayWebhookHandlerService = container.resolve(AbacatepayWebhookHandlerService);
    await abacatepayWebhookHandlerService.execute(request.body);

    return response.status(200).json({ message: 'Abacatepay hook received' });
  }
}
