import type { ApiClientInstance } from "../client";
import type {
  CheckoutValidateRequest,
  CheckoutValidationResponse,
  PaymentIntentResponse,
} from "../../types/cart";

export type { PaymentIntentResponse };

export interface PaymentVerifyResponse {
  success: boolean;
  message: string;
  payment_id: string;
  transaction_id: string;
  status: string;
}

export async function validateCheckoutApi(
  client: ApiClientInstance,
  req: CheckoutValidateRequest,
): Promise<CheckoutValidationResponse> {
  return client<CheckoutValidationResponse>("/checkout/validate", {
    method: "POST",
    body: JSON.stringify(req),
  });
}

export async function getCheckoutSummaryApi(
  client: ApiClientInstance,
  req: CheckoutValidateRequest,
): Promise<CheckoutValidationResponse> {
  return client<CheckoutValidationResponse>("/checkout/summary", {
    method: "POST",
    body: JSON.stringify(req),
  });
}

export async function createPaymentIntentApi(
  client: ApiClientInstance,
  orderId: string,
): Promise<PaymentIntentResponse> {
  return client<PaymentIntentResponse>("/payments/intent", {
    method: "POST",
    body: JSON.stringify({ order_id: orderId, gateway: "RAZORPAY" }),
  });
}

export async function verifyPaymentApi(
  client: ApiClientInstance,
  orderId: string,
  razorpayPaymentId: string,
  razorpayOrderId?: string,
  razorpaySignature?: string,
): Promise<PaymentVerifyResponse> {
  return client<PaymentVerifyResponse>("/payments/verify", {
    method: "POST",
    body: JSON.stringify({
      order_id: orderId,
      razorpay_payment_id: razorpayPaymentId,
      razorpay_order_id: razorpayOrderId,
      razorpay_signature: razorpaySignature,
    }),
  });
}
