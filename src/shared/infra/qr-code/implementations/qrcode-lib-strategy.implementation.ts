import jsQR from 'jsqr';
import { PNG } from 'pngjs';
import QRCode from 'qrcode';
import { IQRCodeProvider } from '../providers/qr-code.provider';
import { AppError } from '../../http/errors/app-error';

class QrcodeLibStrategyImplementation<T> implements IQRCodeProvider<T> {
  public async generate(payload: T): Promise<string> {
    return QRCode.toDataURL(JSON.stringify(payload));
  }

  public async decode(qrCode: string): Promise<T> {
    const content = this.extractQRCodeContent(qrCode);
    return JSON.parse(content) as T;
  }

  private extractQRCodeContent(qrCode: string): string {
    const trimmed = qrCode.trim();

    if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
      return trimmed;
    }

    const base64 = trimmed.includes(',') ? trimmed.split(',')[1] : trimmed;

    if (!base64) {
      throw new AppError(
        400,
        'QR code content could not be decoded.',
        'Conteudo do QR code nao pode ser decodificado.',
      );
    }

    const buffer = Buffer.from(base64, 'base64');
    const png = PNG.sync.read(buffer);
    const result = jsQR(new Uint8ClampedArray(png.data), png.width, png.height);

    if (!result?.data) {
      throw new AppError(
        400,
        'QR code content could not be decoded.',
        'Conteudo do QR code nao pode ser decodificado.',
      );
    }

    return result.data;
  }
}
export { QrcodeLibStrategyImplementation };
