const abacatepayConfig = {
  apiKey: String(process.env.ABACATEPAY_API_KEY),
  apiUrl: String(process.env.ABACATEPAY_API_URL),
  webhookSecret: String(process.env.ABACATEPAY_SECRET),
  pix: {
    expiresIn: 300, // 5 minutes
  },
};
export { abacatepayConfig };
