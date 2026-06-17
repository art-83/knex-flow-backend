import { CardInformation } from '../../entities/card-information.entity';
import { Repository } from 'typeorm';
import { dataSource } from '../../../../../../shared/infra/orm/database';
import { IRepositoryProvider } from '../../../../../../shared/infra/orm/providers/repository.provider';
import { CreateOrUpdateCardInformationDTO } from '../../../../dtos/card-informations/create-or-update-card-information.dto';
import { CardInformationQueryOptions } from '../../../../dtos/card-informations/card-information-query-options.dto';

class CardInformationRepository implements IRepositoryProvider<CardInformation> {
  private repository: Repository<CardInformation>;

  constructor() {
    this.repository = dataSource.getRepository(CardInformation);
  }

  public async create(data: CreateOrUpdateCardInformationDTO): Promise<CardInformation> {
    const create = this.repository.create(data);
    return await this.repository.save(create);
  }

  public async find(options: CardInformationQueryOptions): Promise<CardInformation[]> {
    const query = this.repository.createQueryBuilder('card_information');

    if (options.id) query.andWhere('card_information.id = :id', { id: options.id });
    if (options.last4) query.andWhere('card_information.last4 = :last4', { last4: options.last4 });
    if (options.brand) query.andWhere('card_information.brand = :brand', { brand: options.brand });
    if (options.exp_month) query.andWhere('card_information.exp_month = :exp_month', { exp_month: options.exp_month });
    if (options.exp_year) query.andWhere('card_information.exp_year = :exp_year', { exp_year: options.exp_year });
    if (options.holder_name)
      query.andWhere('card_information.holder_name = :holder_name', { holder_name: options.holder_name });
    if (options.created_at)
      query.andWhere('card_information.created_at = :created_at', { created_at: options.created_at });
    if (options.updated_at)
      query.andWhere('card_information.updated_at = :updated_at', { updated_at: options.updated_at });

    if (options.payment_id)
      query.andWhere('card_information.payment_id = :payment_id', { payment_id: options.payment_id });

    if (options.limit) query.limit(options.limit);
    if (options.offset) query.offset(options.offset);
    if (options.start_date)
      query.andWhere('card_information.created_at >= :start_date', { start_date: options.start_date });
    if (options.end_date) query.andWhere('card_information.created_at <= :end_date', { end_date: options.end_date });

    return await query.getMany();
  }

  public async update(id: string, data: CreateOrUpdateCardInformationDTO): Promise<CardInformation> {
    const create = this.repository.create(data);
    await this.repository.update(id, create);
    return create;
  }

  public async delete(id: string): Promise<number> {
    const deleteResult = await this.repository.softDelete(id);
    return Number(deleteResult.affected);
  }
}
export { CardInformationRepository };
