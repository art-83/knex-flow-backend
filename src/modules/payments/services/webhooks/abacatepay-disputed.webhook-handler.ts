import { IWebhookHandlerProvider } from '../../infra/gateways/providers/webhook-handler.provider';

class AbacatepayDisputedWebhookHandler implements IWebhookHandlerProvider {
  public async handle(payload: Record<string, unknown>): Promise<void> {
    console.log('[Abacatepay] disputed webhook received', payload);
  }
}

export default AbacatepayDisputedWebhookHandler;
