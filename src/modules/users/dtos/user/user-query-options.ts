import { DefaultQueryOptionsDTO } from '../../../../shared/infra/orm/dtos/default-query-options.dto';
import { User } from '../../infra/orm/entities/user.entity';

interface UserQueryOptions extends User, DefaultQueryOptionsDTO {
  includePassword?: boolean;
}
export { UserQueryOptions };
