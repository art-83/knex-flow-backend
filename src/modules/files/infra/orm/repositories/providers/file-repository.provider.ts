import { IRepositoryProvider } from '../../../../../../shared/infra/orm/providers/repository.provider';
import { FileQueryOptionsDTO } from '../../../../dtos/incoming/http/file-query-options.dto';
import { File } from '../../entities/file.entity';

interface IFileRepositoryProvider extends IRepositoryProvider<File> {}
export { IFileRepositoryProvider };
