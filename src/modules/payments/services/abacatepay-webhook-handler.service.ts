import { injectable } from 'tsyringe';
import AbacatePayWebhookHandlerFactory from '../infra/factories/abacate-pay-webhook-handler.factory';

@injectable()
class AbacatepayWebhookHandlerService {
  public async execute(payload: Record<string, unknown>): Promise<void> {
    const handler = AbacatePayWebhookHandlerFactory.create(payload);
    await handler.handle(payload);
  }
}

export default AbacatepayWebhookHandlerService;
