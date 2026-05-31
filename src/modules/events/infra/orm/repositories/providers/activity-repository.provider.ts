import IRepositoryProvider from '../../../../../../shared/infra/orm/providers/repository.provider';
import Activity from '../../entities/activity.entity';

interface IActivityRepositoryProvider extends IRepositoryProvider<Activity> {}

export default IActivityRepositoryProvider;
