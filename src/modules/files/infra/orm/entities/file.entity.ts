import { Column, Entity } from 'typeorm';
import { BaseEntitySequentialGeneratedUUID } from '../../../../../shared/infra/orm/entities/base-entity-sequential-generated-uuid.entity';

@Entity({ name: 'files' })
class StoredFile extends BaseEntitySequentialGeneratedUUID {
  @Column({ unique: true })
  path: string;

  @Column()
  mime_type: string;
}
export { StoredFile };
