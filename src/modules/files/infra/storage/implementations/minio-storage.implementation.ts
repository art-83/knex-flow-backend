import * as Minio from 'minio';
import { minioConfig } from '../../../../../config/minio.config';
import { UploadStorageDTO } from '../../../dtos/storage/upload-storage.dto';
import { IStorageProvider } from '../providers/storage.provider';

class MinioStorageImplementation implements IStorageProvider {
  private client: Minio.Client;
  private bucketReady: Promise<void>;

  constructor() {
    this.client = new Minio.Client({
      endPoint: minioConfig.endPoint,
      port: minioConfig.port,
      useSSL: minioConfig.useSSL,
      accessKey: minioConfig.accessKey,
      secretKey: minioConfig.secretKey,
    });
    this.bucketReady = this.ensureBucket();
  }

  private async ensureBucket(): Promise<void> {
    const exists = await this.client.bucketExists(minioConfig.bucket);
    if (!exists) {
      await this.client.makeBucket(minioConfig.bucket);
    }

    await this.setPublicReadPolicy();
  }

  private async setPublicReadPolicy(): Promise<void> {
    const policy = {
      Version: '2012-10-17',
      Statement: [
        {
          Effect: 'Allow',
          Principal: { AWS: ['*'] },
          Action: ['s3:GetObject'],
          Resource: [`arn:aws:s3:::${minioConfig.bucket}/*`],
        },
      ],
    };

    await this.client.setBucketPolicy(minioConfig.bucket, JSON.stringify(policy));
  }

  public async upload(data: UploadStorageDTO): Promise<void> {
    await this.bucketReady;
    await this.client.putObject(minioConfig.bucket, data.path, data.buffer, data.buffer.length, {
      'Content-Type': data.mime_type,
    });
  }

  public getPublicUrl(path: string): string {
    const baseUrl = minioConfig.publicUrl.replace(/\/$/, '');
    return `${baseUrl}/${minioConfig.bucket}/${path}`;
  }
}
export { MinioStorageImplementation };
