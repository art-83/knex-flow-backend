import IRepositoryProvider from '../../../../../../shared/infra/orm/repositories/providers/repository.provider';
import { User } from '../../entities/user.entity';
import UserQueryOptions from '../../../../dtos/user/user-query-options';

interface IUserRepositoryProvider extends IRepositoryProvider<User> {
  find(data: Partial<UserQueryOptions>): Promise<User[]>;
}

export default IUserRepositoryProvider;
