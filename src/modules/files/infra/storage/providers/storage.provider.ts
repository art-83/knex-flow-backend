import { UploadStorageDTO } from '../../../dtos/internal/storage/upload-storage.dto';

interface IStorageProvider {
  upload(data: UploadStorageDTO): Promise<void>;
  getPublicUrl(path: string): string;
}
export { IStorageProvider };
