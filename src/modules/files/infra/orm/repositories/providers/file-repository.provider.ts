import { IRepositoryProvider } from '../../../../../../shared/infra/orm/providers/repository.provider';
import { StoredFile } from '../../entities/file.entity';

interface IFileRepositoryProvider extends IRepositoryProvider<StoredFile> {}
export { IFileRepositoryProvider };
