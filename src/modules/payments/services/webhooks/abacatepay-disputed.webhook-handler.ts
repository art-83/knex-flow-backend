import { AbacatePayPixWebhookRequestDTO } from '../../dtos/gateways/abacatepay/abacatepay-pix-webhook-request.dto';
import { IWebhookHandlerProvider } from '../../infra/gateways/providers/webhook-handler.provider';

class AbacatepayDisputedWebhookHandler implements IWebhookHandlerProvider<AbacatePayPixWebhookRequestDTO> {
  public async handle(payload: AbacatePayPixWebhookRequestDTO): Promise<void> {
    console.log('[Abacatepay] disputed webhook received', payload);
  }
}
export { AbacatepayDisputedWebhookHandler };
