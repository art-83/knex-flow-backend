import { DefaultQueryOptionsDTO } from '../../../../shared/infra/orm/dtos/default-query-options.dto';
import { Batch } from '../../infra/orm/entities/batch.entity';

interface BatchQueryOptions extends Batch, DefaultQueryOptionsDTO {
  event_id: string;
}
export { BatchQueryOptions };
