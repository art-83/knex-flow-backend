import { DefaultQueryOptionsDTO } from '../../../../../../shared/dtos/incoming/http/query/default-query-options.dto';
import { Batch } from '../../../../infra/orm/entities/batch.entity';

interface BatchQueryOptionsDTO extends Batch, DefaultQueryOptionsDTO {
  event_id: string;
}
export { BatchQueryOptionsDTO };
