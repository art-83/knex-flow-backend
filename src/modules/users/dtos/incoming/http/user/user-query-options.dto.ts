import { DefaultQueryOptionsDTO } from '../../../../../../shared/dtos/incoming/http/query/default-query-options.dto';
import { User } from '../../../../infra/orm/entities/user.entity';

interface UserQueryOptionsDTO extends User, DefaultQueryOptionsDTO {
  includePassword: boolean;
}
export { UserQueryOptionsDTO };
