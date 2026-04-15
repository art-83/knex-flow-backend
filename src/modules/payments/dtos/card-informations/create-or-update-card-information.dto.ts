import CardInformation from '../../infra/orm/entities/card-information.entity';

export interface CreateOrUpdateCardInformationDTO extends CardInformation {
  payment_id: string;
}
