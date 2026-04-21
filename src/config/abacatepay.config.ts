const abacatepayConfig = {
  apiKey: String(process.env.ABACATEPAY_API_KEY),
  apiUrl: String(process.env.ABACATEPAY_API_URL),
  pix: {
    expiresIn: 300, // 5 minutes
  },
};

export default abacatepayConfig;
