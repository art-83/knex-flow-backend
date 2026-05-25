import AbacatepayCompletedWebhookHandler from '../../services/webhooks/abacatepay-completed.webhook-handler';
import AbacatepayDisputedWebhookHandler from '../../services/webhooks/abacatepay-disputed.webhook-handler';
import AbacatepayLostWebhookHandler from '../../services/webhooks/abacatepay-lost.webhook-handler';
import AbacatepayRefundedWebhookHandler from '../../services/webhooks/abacatepay-refunded.webhook-handler';
import { IWebhookHandlerProvider } from '../gateways/providers/webhook-handler.provider';
import { container } from 'tsyringe';
import AbacatePayPixWebhookRequestDTO from '../../dtos/gateways/abacatepay/abacatepay-pix-webhook-request.dto';

class AbacatePayWebhookHandlerFactory {
  public static create(
    payload: AbacatePayPixWebhookRequestDTO,
  ): IWebhookHandlerProvider<AbacatePayPixWebhookRequestDTO> {
    const event = String(payload.event);

    switch (event) {
      case 'transparent.completed':
        return container.resolve(AbacatepayCompletedWebhookHandler);
      case 'transparent.refunded':
        return new AbacatepayRefundedWebhookHandler();
      case 'transparent.disputed':
        return new AbacatepayDisputedWebhookHandler();
      case 'transparent.lost':
        return new AbacatepayLostWebhookHandler();
      default:
        throw new Error(`Webhook handler for event "${event}" not found`);
    }
  }
}

export default AbacatePayWebhookHandlerFactory;
