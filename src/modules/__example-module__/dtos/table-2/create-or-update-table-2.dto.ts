import { Table2 } from '../../infra/orm/entities/table-2-table-with-a-join-column.entity';

interface CreateOrUpdateTable2DTO extends Table2 {
  table1_id: string;
}

export default CreateOrUpdateTable2DTO;
