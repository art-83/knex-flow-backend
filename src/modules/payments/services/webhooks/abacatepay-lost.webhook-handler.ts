import AbacatePayPixWebhookResponseDTO from '../../dtos/gateways/abacatepay/abacate-pay-pix-webhook-response.dto';
import { IWebhookHandlerProvider } from '../../infra/gateways/providers/webhook-handler.provider';

class AbacatepayLostWebhookHandler implements IWebhookHandlerProvider<AbacatePayPixWebhookResponseDTO> {
  public async handle(payload: AbacatePayPixWebhookResponseDTO): Promise<void> {
    console.log('[Abacatepay] lost webhook received', payload);
  }
}

export default AbacatepayLostWebhookHandler;
