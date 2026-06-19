import { orderConfig } from './order.config';

const abacatepayConfig = {
  apiKey: String(process.env.ABACATEPAY_API_KEY),
  apiUrl: String(process.env.ABACATEPAY_API_URL),
  webhookSecret: String(process.env.ABACATEPAY_SECRET),
  pix: {
    expiresIn: orderConfig.pendingTtlMinutes * 60,
  },
};
export { abacatepayConfig };
