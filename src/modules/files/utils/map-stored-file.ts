import { File } from '../infra/orm/entities/file.entity';
import { IStorageProvider } from '../infra/storage/providers/storage.provider';

interface StoredFileAsset {
  id: string;
  path: string;
  url: string;
  mime_type: string;
}

function mapStoredFile(storageProvider: IStorageProvider, file?: File | null): StoredFileAsset | null {
  if (!file) {
    return null;
  }

  return {
    id: file.id,
    path: file.path,
    url: storageProvider.getPublicUrl(file.path),
    mime_type: file.mime_type,
  };
}
export { StoredFileAsset, mapStoredFile };
