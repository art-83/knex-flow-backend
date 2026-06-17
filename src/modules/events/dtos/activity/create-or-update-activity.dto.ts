import { Activity } from '../../infra/orm/entities/activity.entity';

interface CreateOrUpdateActivityDTO extends Activity {
  organization_id: string;
}
export { CreateOrUpdateActivityDTO };
