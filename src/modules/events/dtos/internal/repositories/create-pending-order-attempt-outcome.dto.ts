import { CreatePendingOrderAttemptResultDTO } from './create-pending-order-attempt-result.dto';

interface CreatePendingOrderAttemptOutcomeDTO {
  status: 'success' | 'no_tickets' | 'already_registered' | 'max_participants' | 'activity_not_found';
  data?: CreatePendingOrderAttemptResultDTO;
  event_activity_id?: string;
}
export { CreatePendingOrderAttemptOutcomeDTO };
