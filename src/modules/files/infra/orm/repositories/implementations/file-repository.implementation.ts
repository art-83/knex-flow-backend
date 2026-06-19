import { Repository } from 'typeorm';
import { dataSource } from '../../../../../../shared/infra/orm/database';
import { File } from '../../entities/file.entity';
import { FileQueryOptionsDTO } from '../../../../dtos/incoming/http/file-query-options.dto';
import { IFileRepositoryProvider } from '../providers/file-repository.provider';

class FileRepository implements IFileRepositoryProvider {
  private repository: Repository<File>;

  constructor() {
    this.repository = dataSource.getRepository(File);
  }

  public async find(data: Partial<FileQueryOptionsDTO>): Promise<File[]> {
    const query = this.repository.createQueryBuilder('file');

    if (data.id) query.andWhere('file.id = :id', { id: data.id });

    if (data.user_id) query.andWhere('file.user_id = :user_id', { user_id: data.user_id });

    if (data.path) query.andWhere('file.path = :path', { path: data.path });

    if (data.mime_type) query.andWhere('file.mime_type = :mime_type', { mime_type: data.mime_type });

    if (data.created_at) query.andWhere('file.created_at = :created_at', { created_at: data.created_at });

    if (data.updated_at) query.andWhere('file.updated_at = :updated_at', { updated_at: data.updated_at });

    if (data.limit) query.limit(data.limit);
    if (data.offset) query.offset(data.offset);

    return await query.getMany();
  }

  public async create(data: Partial<File>): Promise<File> {
    const create = this.repository.create(data);
    return await this.repository.save(create);
  }

  public async update(id: string, data: Partial<File>): Promise<File> {
    const update = this.repository.create(data);
    await this.repository.update(id, update);
    return update;
  }

  public async delete(id: string): Promise<number> {
    const deleteResult = await this.repository.softDelete(id);
    return Number(deleteResult.affected);
  }
}
export { FileRepository };
