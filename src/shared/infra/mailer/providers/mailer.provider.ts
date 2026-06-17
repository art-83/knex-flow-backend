interface IMailerProvider {
  sendEmail(to: string[], subject: string, content: string): Promise<void>;
}

export { IMailerProvider };
