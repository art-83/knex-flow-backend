import DefaultQueryOptionsDTO from '../../../../shared/infra/orm/dtos/default-query-options.dto';
import CardInformation from '../../infra/orm/entities/card-information.entity';

export interface CardInformationQueryOptions extends CardInformation, DefaultQueryOptionsDTO {
  payment_id: string;
}
