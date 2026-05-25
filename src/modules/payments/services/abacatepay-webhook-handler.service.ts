import { injectable } from 'tsyringe';
import AbacatePayWebhookHandlerFactory from '../infra/factories/abacate-pay-webhook-handler.factory';
import AbacatePayPixWebhookResponseDTO from '../dtos/gateways/abacatepay/abacate-pay-pix-webhook-response.dto';

@injectable()
class AbacatepayWebhookHandlerService {
  public async execute(payload: AbacatePayPixWebhookResponseDTO): Promise<void> {
    const handler = AbacatePayWebhookHandlerFactory.create(payload);
    await handler.handle(payload);
  }
}

export default AbacatepayWebhookHandlerService;
