/**
 * Cart, Checkout, and Coupon Types
 * Shared across Student and Admin applications.
 */

import type { StudentMenuItem } from "./menu";
import type { StudentOrderStatus } from "./order";

/** Client-side cart item representation in student app */
export interface CartItem {
  menuItem: StudentMenuItem;
  quantity: number;
  restaurantId: string;
  cartItemId?: string;
  instructions?: string;
}

/** Student order view model */
export interface StudentOrder {
  id: string;
  restaurantId: string;
  restaurantName: string;
  items: CartItem[];
  total: number;
  pickupTime: string;
  date: string;
  status: StudentOrderStatus;
  fulfillmentMode?: "DINE_IN" | "TAKEAWAY";
  gameTicketCode?: string;
  gamePlatformName?: string;
  scheduledPushAt?: string;
  autoPushed?: boolean;
}

export interface BackendCartItem {
  id: string;
  cart_id: string;
  menu_item_id: string;
  quantity: number;
  selected_modifiers?: unknown;
  menu_item_name?: string | null;
  unit_price?: number | null;
  subtotal?: number | null;
  is_available?: boolean;
  created_at: string;
  updated_at: string;
}

export interface BackendCart {
  id: string;
  customer_profile_id: string;
  branch_id: string;
  items: BackendCartItem[];
  total_items: number;
  subtotal: number;
  is_expired: boolean;
  created_at: string;
  updated_at: string;
}

export interface CartIssue {
  code: string;
  message: string;
  item_id?: string;
  menu_item_id?: string;
}

export interface CartValidationResponse {
  is_valid: boolean;
  issues: CartIssue[];
  subtotal: number;
  total_items: number;
}

export interface CheckoutValidateRequest {
  cart_id: string;
  coupon_code?: string | null;
  delivery_address_id?: string | null;
}

export interface CheckoutItemSummary {
  menu_item_id: string;
  name: string;
  unit_price: number;
  quantity: number;
  subtotal: number;
  is_available: boolean;
}

export interface CheckoutIssue {
  code: string;
  message: string;
}

export interface CheckoutValidationResponse {
  is_valid: boolean;
  customer_id: string;
  branch_id: string;
  branch_name: string;
  kitchen_id?: string | null;
  cart_id: string;
  subtotal: number;
  tax_amount: number;
  delivery_fee: number;
  discount_amount: number;
  final_payable_amount: number;
  coupon_code?: string | null;
  items: CheckoutItemSummary[];
  issues: CheckoutIssue[];
}

export interface PaymentIntentResponse {
  order_id: string;
  payment_intent_id: string;
  client_secret: string;
  amount: number;
  currency: string;
  gateway?: string;
}

export interface CouponValidationResponse {
  is_valid: boolean;
  code: string;
  discount_type: "PERCENTAGE" | "FLAT";
  discount_value: number;
  discount_amount: number;
  message?: string;
}

export interface AdminCoupon {
  id: string;
  code: string;
  discount_type: "PERCENTAGE" | "FLAT";
  discount_value: number;
  min_order_amount?: number | null;
  max_discount_amount?: number | null;
  valid_from: string;
  valid_until: string;
  branch_id?: string | null;
  is_active?: boolean;
}

export interface ReviewModerationResult {
  id: string;
  is_hidden: boolean;
  moderation_reason?: string | null;
}
