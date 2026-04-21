import { inject, injectable } from 'tsyringe';
import { AbacatepayCreatePixPaymentDTO } from '../dtos/gateways/abacatepay-create-pix-payment.dto';
import { AbacatepayPixPaymentResponseDTO } from '../dtos/gateways/abacatepay-pix-payment-response.dto';
import { IPaymentGatewayProvider } from '../infra/gateways/providers/payment-gateway.provider';
import { PaymentMethod } from '../infra/orm/enums/payment-method.enum';
import abacatepayConfig from '../../../config/abacatepay.config';

@injectable()
class CreatePixPaymentService {
  constructor(
    @inject('PixGatewayProvider')
    private pixGatewayProvider: IPaymentGatewayProvider<AbacatepayCreatePixPaymentDTO, AbacatepayPixPaymentResponseDTO>,
  ) {}

  public async execute(data: AbacatepayCreatePixPaymentDTO): Promise<AbacatepayPixPaymentResponseDTO> {
    const payload = {
      method: PaymentMethod.PIX,
      data: {
        amount: data.amount,
        expiresIn: abacatepayConfig.pix.expiresIn,
      },
    };
    return await this.pixGatewayProvider.createPayment(payload);
  }
}

export default CreatePixPaymentService;
