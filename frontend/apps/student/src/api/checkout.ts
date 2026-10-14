import { apiClient } from "./client";

import {
  validateCheckoutApi as sharedValidateCheckout,
  getCheckoutSummaryApi as sharedGetCheckoutSummary,
  createPaymentIntentApi as sharedCreatePaymentIntent,
  verifyPaymentApi as sharedVerifyPayment,
} from "@syncbite/shared";

import type {
  CheckoutValidateRequest,
  CheckoutItemSummary,
  CheckoutIssue,
  CheckoutValidationResponse,
  PaymentIntentResponse,
  PaymentVerifyResponse,
} from "@syncbite/shared";

export type {
  CheckoutValidateRequest,
  CheckoutItemSummary,
  CheckoutIssue,
  CheckoutValidationResponse,
  PaymentIntentResponse,
  PaymentVerifyResponse,
};

export async function validateCheckoutApi(
  req: CheckoutValidateRequest,
): Promise<CheckoutValidationResponse> {
  return sharedValidateCheckout(apiClient, req);
}

export async function getCheckoutSummaryApi(
  req: CheckoutValidateRequest,
): Promise<CheckoutValidationResponse> {
  return sharedGetCheckoutSummary(apiClient, req);
}

export async function createPaymentIntentApi(orderId: string): Promise<PaymentIntentResponse> {
  return sharedCreatePaymentIntent(apiClient, orderId);
}

export async function verifyPaymentApi(
  orderId: string,
  razorpayPaymentId: string,
  razorpayOrderId?: string,
  razorpaySignature?: string,
): Promise<PaymentVerifyResponse> {
  return sharedVerifyPayment(
    apiClient,
    orderId,
    razorpayPaymentId,
    razorpayOrderId,
    razorpaySignature,
  );
}
