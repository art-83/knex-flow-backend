import { Request, Response } from 'express';

export class HooksController {
  public async onCompleted(request: Request, response: Response): Promise<Response> {
    return response.status(202).json({
      accepted: true,
      provider: 'ABACATEPAY',
      flow: 'transparent_checkout',
      event: 'transparent.completed',
      payload: request.body,
      message: 'Webhook received. Processing will be handled by a future service.',
    });
  }

  public async onRefunded(request: Request, response: Response): Promise<Response> {
    return response.status(202).json({
      accepted: true,
      provider: 'ABACATEPAY',
      flow: 'transparent_checkout',
      event: 'transparent.refunded',
      payload: request.body,
      message: 'Webhook received. Processing will be handled by a future service.',
    });
  }

  public async onDisputed(request: Request, response: Response): Promise<Response> {
    return response.status(202).json({
      accepted: true,
      provider: 'ABACATEPAY',
      flow: 'transparent_checkout',
      event: 'transparent.disputed',
      payload: request.body,
      message: 'Webhook received. Processing will be handled by a future service.',
    });
  }

  public async onLost(request: Request, response: Response): Promise<Response> {
    return response.status(202).json({
      accepted: true,
      provider: 'ABACATEPAY',
      flow: 'transparent_checkout',
      event: 'transparent.lost',
      payload: request.body,
      message: 'Webhook received. Processing will be handled by a future service.',
    });
  }

  public async onAny(request: Request, response: Response): Promise<Response> {
    return response.status(202).json({
      accepted: true,
      provider: 'ABACATEPAY',
      flow: 'transparent_checkout',
      event: request.body?.event ?? 'unknown',
      payload: request.body,
      message: 'Webhook received. Processing will be handled by a future service.',
    });
  }
}
