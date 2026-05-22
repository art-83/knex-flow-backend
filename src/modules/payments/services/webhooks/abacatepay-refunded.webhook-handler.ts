import { IWebhookHandlerProvider } from '../../infra/gateways/providers/webhook-handler.provider';

class AbacatepayRefundedWebhookHandler implements IWebhookHandlerProvider {
  public async handle(payload: Record<string, unknown>): Promise<void> {
    console.log('[Abacatepay] refunded webhook received', payload);
  }
}

export default AbacatepayRefundedWebhookHandler;
