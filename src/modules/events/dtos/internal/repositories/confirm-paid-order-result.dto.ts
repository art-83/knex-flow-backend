interface ConfirmPaidOrderResultDTO {
  status: 'confirmed' | 'already_confirmed' | 'order_not_found' | 'payment_not_found' | 'payment_order_mismatch';
}
export { ConfirmPaidOrderResultDTO };
