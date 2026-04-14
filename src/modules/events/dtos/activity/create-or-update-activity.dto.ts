import { Activity } from '../../infra/orm/entities/activity.entity';

interface CreateOrUpdateActivityDTO extends Activity {
  // TODO: quando Organization virar @ManyToOne, declarar organization_id: string aqui
}

export default CreateOrUpdateActivityDTO;
