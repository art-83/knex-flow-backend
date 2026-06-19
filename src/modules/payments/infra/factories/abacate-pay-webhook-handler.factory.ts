import { inject, injectable } from 'tsyringe';
import { AppError } from '../../../../shared/infra/http/errors/app-error';
import { AbacatepayCompletedWebhookHandler } from '../../services/webhooks/abacatepay-completed.webhook-handler';
import { AbacatepayDisputedWebhookHandler } from '../../services/webhooks/abacatepay-disputed.webhook-handler';
import { AbacatepayLostWebhookHandler } from '../../services/webhooks/abacatepay-lost.webhook-handler';
import { AbacatepayRefundedWebhookHandler } from '../../services/webhooks/abacatepay-refunded.webhook-handler';
import { IWebhookHandlerProvider } from '../gateways/providers/webhook-handler.provider';
import { AbacatePayTransparentWebhookRequestDTO } from '../../dtos/incoming/webhooks/abacatepay/transparent-webhook-request.dto';

@injectable()
class AbacatePayWebhookHandlerFactory {
  constructor(
    @inject(AbacatepayCompletedWebhookHandler)
    private completedHandler: AbacatepayCompletedWebhookHandler,
    @inject(AbacatepayRefundedWebhookHandler)
    private refundedHandler: AbacatepayRefundedWebhookHandler,
    @inject(AbacatepayDisputedWebhookHandler)
    private disputedHandler: AbacatepayDisputedWebhookHandler,
    @inject(AbacatepayLostWebhookHandler)
    private lostHandler: AbacatepayLostWebhookHandler,
  ) {}

  public create(
    payload: AbacatePayTransparentWebhookRequestDTO,
  ): IWebhookHandlerProvider<AbacatePayTransparentWebhookRequestDTO> {
    const event = String(payload.event);

    switch (event) {
      case 'transparent.completed':
        return this.completedHandler;
      case 'transparent.refunded':
        return this.refundedHandler;
      case 'transparent.disputed':
        return this.disputedHandler;
      case 'transparent.lost':
        return this.lostHandler;
      default:
        throw new AppError(
          404,
          `Webhook handler for event "${event}" not found`,
          `Handler de webhook para o evento "${event}" nao encontrado.`,
        );
    }
  }
}
export { AbacatePayWebhookHandlerFactory };
