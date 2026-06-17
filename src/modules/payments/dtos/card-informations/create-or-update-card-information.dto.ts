import { CardInformation } from '../../infra/orm/entities/card-information.entity';

interface CreateOrUpdateCardInformationDTO extends CardInformation {
  payment_id: string;
}
export { CreateOrUpdateCardInformationDTO };
