import DefaultQueryOptionsDTO from '../../../../shared/infra/orm/dtos/default-query-options.dto';
import { Activity } from '../../infra/orm/entities/activity.entity';

interface ActivityQueryOptions extends Activity, DefaultQueryOptionsDTO {}

export default ActivityQueryOptions;
