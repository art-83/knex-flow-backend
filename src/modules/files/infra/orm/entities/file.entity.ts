import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntitySequentialGeneratedUUID } from '../../../../../shared/infra/orm/entities/base-entity-sequential-generated-uuid.entity';
import { User } from '../../../../users/infra/orm/entities/user.entity';

@Entity({ name: 'files' })
class File extends BaseEntitySequentialGeneratedUUID {
  @Column({ unique: true })
  path: string;

  @Column()
  mime_type: string;

  @ManyToOne(() => User, user => user.files)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
export { File };
