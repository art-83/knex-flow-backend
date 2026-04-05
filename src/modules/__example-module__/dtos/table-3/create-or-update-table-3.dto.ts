import { Table3 } from '../../infra/orm/entities/table-3-many-to-many-table.entity';

interface CreateOrUpdateTable3DTO extends Table3 {
  table1_id: string;
  table2_id: string;
}

export default CreateOrUpdateTable3DTO;
