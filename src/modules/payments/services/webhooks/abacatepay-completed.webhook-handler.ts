import { IWebhookHandlerProvider } from '../../infra/gateways/providers/webhook-handler.provider';

class AbacatepayCompletedWebhookHandler implements IWebhookHandlerProvider {
  public async handle(payload: Record<string, unknown>): Promise<void> {
    console.log('[Abacatepay] completed webhook received', payload);
  }
}

export default AbacatepayCompletedWebhookHandler;
