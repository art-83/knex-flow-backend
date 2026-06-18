import { IAddressRepositoryProvider } from '../providers/address-repository.provider';
import { Address } from '../../entities/address.entity';
import { Repository } from 'typeorm';
import { dataSource } from '../../../../../../shared/infra/orm/database';

class AddressRepository implements IAddressRepositoryProvider {
  private repository: Repository<Address>;

  constructor() {
    this.repository = dataSource.getRepository(Address);
  }

  public async find(data: Partial<Address>): Promise<Address[]> {
    const query = this.repository.createQueryBuilder('address');

    if (data.id) query.andWhere('address.id = :id', { id: data.id });
    if (data.street) query.andWhere('address.street = :street', { street: data.street });
    if (data.number) query.andWhere('address.number = :number', { number: data.number });
    if (data.city) query.andWhere('address.city = :city', { city: data.city });
    if (data.state) query.andWhere('address.state = :state', { state: data.state });
    if (data.country) query.andWhere('address.country = :country', { country: data.country });
    if (data.zip_code) query.andWhere('address.zip_code = :zip_code', { zip_code: data.zip_code });

    return await query.getMany();
  }

  public async create(data: Partial<Address>): Promise<Address> {
    const create = this.repository.create(data);
    return await this.repository.save(create);
  }

  public async update(id: string, data: Partial<Address>): Promise<Address> {
    const update = this.repository.create(data);
    await this.repository.update(id, update);
    return update;
  }

  public async delete(id: string): Promise<number> {
    const deleteResult = await this.repository.softDelete(id);
    return Number(deleteResult.affected);
  }
}
export { AddressRepository };
