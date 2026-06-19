import { inject, injectable } from 'tsyringe';
import { AbacatePayWebhookHandlerFactory } from '../../infra/factories/abacate-pay-webhook-handler.factory';
import { AbacatePayTransparentWebhookRequestDTO } from '../../dtos/incoming/webhooks/abacatepay/transparent-webhook-request.dto';

@injectable()
class AbacatepayWebhookHandlerService {
  constructor(
    @inject(AbacatePayWebhookHandlerFactory)
    private webhookHandlerFactory: AbacatePayWebhookHandlerFactory,
  ) {}

  public async execute(payload: AbacatePayTransparentWebhookRequestDTO): Promise<void> {
    const handler = this.webhookHandlerFactory.create(payload);
    await handler.handle(payload);
  }
}
export { AbacatepayWebhookHandlerService };
