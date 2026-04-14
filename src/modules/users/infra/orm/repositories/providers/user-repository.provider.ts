import IRepositoryProvider from '../../../../../../shared/infra/orm/repositories/providers/repository.provider';
import { User } from '../../entities/user.entity';

interface IUserRepositoryProvider extends IRepositoryProvider<User> {}

export default IUserRepositoryProvider;
