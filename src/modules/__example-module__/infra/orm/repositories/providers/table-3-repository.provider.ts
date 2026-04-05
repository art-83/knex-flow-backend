import IRepositoryProvider from '../../../../../../shared/infra/orm/repositories/providers/repository.provider';
import Table3 from '../../entities/table-3-many-to-many-table.entity';

interface ITable3RepositoryProvider extends IRepositoryProvider<Table3> {
  countAmountofTable1PlusTable2(): Promise<number>;
}

export default ITable3RepositoryProvider;
