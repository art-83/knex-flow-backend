import { IWebhookHandlerProvider } from '../../infra/gateways/providers/webhook-handler.provider';

class AbacatepayLostWebhookHandler implements IWebhookHandlerProvider {
  public async handle(payload: Record<string, unknown>): Promise<void> {
    console.log('[Abacatepay] lost webhook received', payload);
  }
}

export default AbacatepayLostWebhookHandler;
