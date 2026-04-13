import IRepositoryProvider from '../../../../../../shared/infra/orm/repositories/providers/repository.provider';
import Activity from '../../entities/activity.entity';

interface IActivityRepositoryProvider extends IRepositoryProvider<Activity> {}

export default IActivityRepositoryProvider;
