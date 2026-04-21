export interface IPaymentGatewayProvider<TPaymentDTO = unknown, TPaymentResponseDTO = unknown> {
  createPayment(data: Partial<TPaymentDTO>): Promise<TPaymentResponseDTO>;
}
