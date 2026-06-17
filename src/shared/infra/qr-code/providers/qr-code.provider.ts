interface IQRCodeProvider<T> {
  generate(payload: T): Promise<string>;
  decode(qrCode: string): Promise<T>;
}
export { IQRCodeProvider };
