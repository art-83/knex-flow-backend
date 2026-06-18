import { inject, injectable } from 'tsyringe';
import { AppError } from '../../../../shared/infra/http/errors/app-error';
import { UploadFileDTO } from '../../dtos/file/upload-file.dto';
import { UploadFileResponseDTO } from '../../dtos/file/upload-file-response.dto';
import { IFileRepositoryProvider } from '../../infra/orm/repositories/providers/file-repository.provider';
import { IStorageProvider } from '../../infra/storage/providers/storage.provider';
import { buildFilePath } from '../../utils/build-file-path';
import { User } from '../../../users/infra/orm/entities/user.entity';

@injectable()
class UploadFileService {
  constructor(
    @inject('FileRepositoryProvider')
    private fileRepository: IFileRepositoryProvider,
    @inject('StorageProvider')
    private storageProvider: IStorageProvider,
  ) {}

  public async execute(user_id: string, file?: UploadFileDTO): Promise<UploadFileResponseDTO> {
    if (!file) {
      throw new AppError(400, 'File is required.', 'Arquivo e obrigatorio.');
    }

    const filePath = buildFilePath(file.originalname);
    const mime_type = file.mimetype || 'application/octet-stream';

    await this.storageProvider.upload({
      buffer: file.buffer,
      path: filePath,
      mime_type,
    });

    const savedFile = await this.fileRepository.create({
      path: filePath,
      mime_type,
      user: { id: user_id } as User,
    });

    return {
      id: savedFile.id,
      path: savedFile.path,
      mime_type: savedFile.mime_type,
      user_id,
      created_at: savedFile.created_at,
      updated_at: savedFile.updated_at,
      deleted_at: savedFile.deleted_at ?? null,
      url: this.storageProvider.getPublicUrl(filePath),
    };
  }
}
export { UploadFileService };
