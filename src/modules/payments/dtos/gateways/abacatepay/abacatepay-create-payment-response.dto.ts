export interface AbacatepayCreatePaymentResponse {
  id: string;
  status: string;
  amount: number;
  brCode: string;
  brCodeBase64: string;
  expiresAt: string;
}

export default AbacatepayCreatePaymentResponse;
