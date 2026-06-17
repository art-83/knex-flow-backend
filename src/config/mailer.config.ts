const mailerConfig = {
  apiKey: String(process.env.MAILER_API_KEY),
  apiUrl: String(process.env.MAILER_API_URL),
  from: String(process.env.MAILER_FROM),
};
export { mailerConfig };
