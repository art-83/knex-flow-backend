const abacatepayConfig = {
  apiKey: String(process.env.ABACATEPAY_API_KEY),
  apiUrl: String(process.env.ABACATEPAY_API_URL),
  webhookSecret: String(process.env.ABACATEPAY_SECRET),
  pix: {
    expiresIn: Number(process.env.ABACATEPAY_PIX_EXPIRES_IN),
  },
};
export { abacatepayConfig };
