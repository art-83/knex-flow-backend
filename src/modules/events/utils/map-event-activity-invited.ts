import { mapStoredFile } from '../../files/utils/map-stored-file';
import { IStorageProvider } from '../../files/infra/storage/providers/storage.provider';
import { EventActivityInvited } from '../infra/orm/entities/event-activity-invited.entity';

function mapEventActivityInvited(storageProvider: IStorageProvider, invited: EventActivityInvited) {
  return {
    id: invited.id,
    event_activity_id: invited.event_activity.id,
    name: invited.name,
    institution: invited.institution,
    profession: invited.profession,
    user_id: invited.user?.id ?? null,
    file: mapStoredFile(storageProvider, invited.file),
  };
}
export { mapEventActivityInvited };
