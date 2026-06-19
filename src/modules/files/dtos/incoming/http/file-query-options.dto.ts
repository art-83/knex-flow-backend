import { DefaultQueryOptionsDTO } from '../../../../../shared/dtos/incoming/http/query/default-query-options.dto';
import { File } from '../../../infra/orm/entities/file.entity';

interface FileQueryOptionsDTO extends File, DefaultQueryOptionsDTO {
  user_id: string;
}
export { FileQueryOptionsDTO };
