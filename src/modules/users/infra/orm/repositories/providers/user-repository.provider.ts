import { IRepositoryProvider } from '../../../../../../shared/infra/orm/providers/repository.provider';
import { User } from '../../entities/user.entity';
import { UserQueryOptionsDTO } from '../../../../dtos/incoming/http/user/user-query-options.dto';

interface IUserRepositoryProvider extends IRepositoryProvider<User> {
  find(data: Partial<UserQueryOptionsDTO>): Promise<User[]>;
}
export { IUserRepositoryProvider };
