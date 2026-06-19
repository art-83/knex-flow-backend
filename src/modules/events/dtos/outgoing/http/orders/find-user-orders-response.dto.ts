import { OrderStatus } from '../../../../infra/orm/enums/order-status.enum';

interface UserOrderSummaryDTO {
  id: string;
  status: OrderStatus;
  total_amount: number;
  created_at: Date;
  updated_at: Date;
  paid_at: Date | null;
  ticket: { id: string; availability: string } | null;
  event: { id: string; name: string; start_date: Date; end_date: Date } | null;
}

interface FindUserOrdersResponseDTO {
  message: string;
  data: UserOrderSummaryDTO[];
  meta: {
    refund_window_days: number;
  };
}
export { FindUserOrdersResponseDTO, UserOrderSummaryDTO };
