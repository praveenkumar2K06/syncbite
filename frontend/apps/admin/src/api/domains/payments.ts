import { apiClient } from "../client";
import {
  getPaymentByIdApi as sharedGetPaymentByIdApi,
  issueRefundApi as sharedIssueRefundApi,
  issueRefundOverrideApi as sharedIssueRefundOverrideApi,
  type RefundOverrideRequest,
  type RefundOverrideResponse,
  type PaymentTransactionResponse,
  type PaymentResponse,
} from "@syncbite/shared";

export type {
  RefundOverrideRequest,
  RefundOverrideResponse,
  PaymentTransactionResponse,
  PaymentResponse,
};

export async function getPaymentByIdApi(id: string): Promise<PaymentResponse> {
  return sharedGetPaymentByIdApi(apiClient, id);
}

export async function issueRefundApi(
  paymentId: string,
  amount: number,
  reason = "ORDER_CANCELLED",
): Promise<PaymentTransactionResponse> {
  return sharedIssueRefundApi(apiClient, paymentId, amount, reason);
}

export async function issueRefundOverrideApi(
  payload: RefundOverrideRequest,
): Promise<RefundOverrideResponse> {
  return sharedIssueRefundOverrideApi(apiClient, payload);
}
