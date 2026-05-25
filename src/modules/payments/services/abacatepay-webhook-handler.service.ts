import { injectable } from 'tsyringe';
import AbacatePayWebhookHandlerFactory from '../infra/factories/abacate-pay-webhook-handler.factory';
import AbacatePayPixWebhookRequestDTO from '../dtos/gateways/abacatepay/abacatepay-pix-webhook-request.dto';

@injectable()
class AbacatepayWebhookHandlerService {
  public async execute(payload: AbacatePayPixWebhookRequestDTO): Promise<void> {
    const handler = AbacatePayWebhookHandlerFactory.create(payload);
    await handler.handle(payload);
  }
}

export default AbacatepayWebhookHandlerService;
