import { DefaultQueryOptionsDTO } from '../../../../../shared/dtos/incoming/http/query/default-query-options.dto';
import { CardInformation } from '../../../infra/orm/entities/card-information.entity';

interface CardInformationQueryOptionsDTO extends CardInformation, DefaultQueryOptionsDTO {
  payment_id: string;
}
export { CardInformationQueryOptionsDTO };
