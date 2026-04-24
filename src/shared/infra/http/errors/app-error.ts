export default class AppError {
  public readonly code: number;
  public readonly message: string;
  public readonly formattedMessage: string;

  constructor(code: number, message: string, formattedMessage: string) {
    this.code = code;
    this.message = message;
    this.formattedMessage = formattedMessage;
  }
}
