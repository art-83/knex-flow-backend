import { Event } from '../../infra/orm/entities/event.entity';
import { Address } from '../../infra/orm/entities/address.entity';

interface CreateOrUpdateEventDTO extends Omit<Event, 'file' | 'address' | 'organization'> {
  organization_id: string;
  file_id?: string | null;
  address?: Partial<Address> | null;
  organization?: Event['organization'];
}
export { CreateOrUpdateEventDTO };
