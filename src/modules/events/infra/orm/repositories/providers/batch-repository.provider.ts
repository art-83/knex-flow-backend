import IRepositoryProvider from '../../../../../../shared/infra/orm/repositories/providers/repository.provider';
import Batch from '../../entities/batch.entity';

interface IBatchRepositoryProvider extends IRepositoryProvider<Batch> {}

export default IBatchRepositoryProvider;
