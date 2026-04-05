import DefaultQueryOptionsDTO from '../../../../shared/infra/orm/dtos/default-query-options.dto';
import { Table3 } from '../../infra/orm/entities/table-3-many-to-many-table.entity';

interface Table3QueryOptions extends Table3, DefaultQueryOptionsDTO {
  table1_id: string;
  table2_id: string;
}

export default Table3QueryOptions;
