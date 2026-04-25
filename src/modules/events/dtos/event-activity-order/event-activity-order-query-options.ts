import DefaultQueryOptionsDTO from '../../../../shared/infra/orm/dtos/default-query-options.dto';
import { EventActivityOrder } from '../../infra/orm/entities/event-activity-order.entity';

interface EventActivityOrderQueryOptions extends EventActivityOrder, DefaultQueryOptionsDTO {
  event_activity_id: string;
  order_id: string;
}

export default EventActivityOrderQueryOptions;
