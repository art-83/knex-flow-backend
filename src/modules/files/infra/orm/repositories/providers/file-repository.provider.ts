import { IRepositoryProvider } from '../../../../../../shared/infra/orm/providers/repository.provider';
import { FileQueryOptions } from '../../../../dtos/file/file-query-options';
import { File } from '../../entities/file.entity';

interface IFileRepositoryProvider extends IRepositoryProvider<File> {}
export { IFileRepositoryProvider };
