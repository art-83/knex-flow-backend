import { DefaultQueryOptionsDTO } from '../../../../shared/infra/orm/dtos/default-query-options.dto';
import { File } from '../../infra/orm/entities/file.entity';

interface FileQueryOptions extends File, DefaultQueryOptionsDTO {
  user_id: string;
}
export { FileQueryOptions };
