import { Event } from '../../../../infra/orm/entities/event.entity';
import { Address } from '../../../../infra/orm/entities/address.entity';

interface CreateOrUpdateEventDTO extends Omit<Event, 'banner_file' | 'icon_file' | 'address' | 'organization'> {
  organization_id: string;
  banner_file_id?: string | null;
  icon_file_id?: string | null;
  address?: Partial<Address> | null;
  organization?: Event['organization'];
}
export { CreateOrUpdateEventDTO };
