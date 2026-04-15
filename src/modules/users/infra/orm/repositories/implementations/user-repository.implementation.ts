import IUserRepositoryProvider from '../providers/user-repository.provider';
import { User } from '../../entities/user.entity';
import UserQueryOptions from '../../../../dtos/user/user-query-options';
import { Repository } from 'typeorm';
import dataSource from '../../../../../../shared/infra/orm/database';

class UserRepository implements IUserRepositoryProvider {
  private repository: Repository<User>;

  constructor() {
    this.repository = dataSource.getRepository(User);
  }

  public async find(data: Partial<UserQueryOptions>): Promise<User[]> {
    const query = this.repository.createQueryBuilder('user');

    if (data.includePassword) {
      query.addSelect('user.password');
    }

    if (data.id) query.andWhere('user.id = :id', { id: data.id });
    if (data.email) query.andWhere('user.email = :email', { email: data.email });
    if (data.phone) query.andWhere('user.phone = :phone', { phone: data.phone });

    if (data.limit) query.limit(data.limit);
    if (data.offset) query.offset(data.offset);

    return await query.getMany();
  }

  public async create(data: User): Promise<User> {
    const entity = this.repository.create(data);
    return await this.repository.save(entity);
  }

  public async update(id: string, data: User): Promise<User> {
    const entity = this.repository.create({ ...data, id });
    return await this.repository.save(entity);
  }

  public async delete(id: string): Promise<number> {
    const deleteResult = await this.repository.softDelete(id);
    return Number(deleteResult.affected);
  }
}

export default UserRepository;
