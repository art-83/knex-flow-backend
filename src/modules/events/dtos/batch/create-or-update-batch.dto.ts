import { Batch } from '../../infra/orm/entities/batch.entity';

interface CreateOrUpdateBatchDTO extends Batch {
  event_id: string;
}

export default CreateOrUpdateBatchDTO;
