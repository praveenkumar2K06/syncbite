export interface PaymentTransactionRecord {
  id: string;
  order_id: string;
  merchant_name: string;
  customer_name: string;
  amount: number;
  type: "PAYMENT" | "REFUND" | "PARTIAL_REFUND";
  status: "SUCCESS" | "FAILED" | "PENDING" | "—";
  provider: string;
  gateway_ref: string;
  created_at: string;
  refund_reason?: string;
}

export interface AdminOverrideModalState {
  open: boolean;
  paymentId: string;
  amount: string;
  reason: string;
  submitting: boolean;
}
