/**
 * Admin, Analytics, Feature Flags, and Onboarding Types
 * Used in Admin application and backend management endpoints.
 */

export interface AuditLog {
  id: string;
  admin_user_id: string;
  action: string;
  target_entity: string;
  target_entity_id: string | null;
  changes_payload: Record<string, unknown>;
  ip_address: string;
  created_at: string;
}

export interface FeatureFlag {
  flag_key: string;
  enabled: boolean;
  value: string | null;
}

export interface PlatformAnalytics {
  total_merchants: number;
  active_merchants: number;
  total_orders: number;
  gross_revenue: number;
  platform_commissions: number;
  total_customers: number;
}

export interface OnboardFormData {
  name: string;
  email: string;
  password: string;
  address: string;
  legal_entity_name: string;
  fssai_license_number: string;
  gstin: string;
  opening_time?: string;
  closing_time?: string;
  cuisine_types?: string;
  description?: string;
  bank_account_number?: string;
  bank_ifsc_code?: string;
  status?: string;
  has_separate_branch_manager?: boolean;
  branch_manager_name?: string;
  branch_manager_email?: string;
  branch_manager_password?: string;
  branch_manager_phone?: string;
  subscription_plan?: "BASIC" | "PROFESSIONAL" | "ENTERPRISE";
  subscription_cycle?: "MONTHLY" | "ANNUAL";
}

export interface OnboardResult {
  user_id: string;
  email: string;
  merchant_id: string;
  status: string;
  temp_password: string;
}

export interface OnboardSuccessState {
  branch_name: string;
  email: string;
  password: string;
  branch_id?: string;
  brand_id?: string;
  merchant_id?: string;
  role?: string;
  status?: string;
  has_branch_manager?: boolean;
  branch_manager_email?: string;
  branch_manager_password?: string;
  branch_manager_role?: string;
  subscription_plan?: string;
  subscription_cycle?: string;
  subscription_id?: string;
}

export interface CredentialModalState {
  open: boolean;
  branchId: string;
  branchName: string;
  currentEmail: string;
  newEmail: string;
  newPassword: string;
  showPassword: boolean;
  passwordGenerated?: boolean;
  role?: "BranchManager" | "MerchantOwner";
  managerName?: string;
  managerPhone?: string;
  userId?: string;
  updatedResult?: { email: string; password: string; role?: string } | null;
}

export interface AdminCustomerAddressResponse {
  id: string;
  address_line: string;
  building_name?: string | null;
  campus_zone: string;
  is_primary: boolean;
  created_at: string;
  updated_at: string;
}

export interface AdminCustomerResponse {
  id: string;
  user_id: string;
  email: string;
  full_name: string;
  phone_number?: string | null;
  is_active: boolean;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface AdminCustomerDetailResponse {
  id: string;
  user_id: string;
  email: string;
  full_name: string;
  phone_number?: string | null;
  is_active: boolean;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
  addresses: AdminCustomerAddressResponse[];
  total_orders: number;
  total_spent: number;
}

export interface AdminCustomerUpdateRequest {
  full_name?: string | null;
  phone_number?: string | null;
  is_active?: boolean | null;
  is_verified?: boolean | null;
}

export interface AdminSetPasswordRequest {
  user_id?: string | null;
  email?: string | null;
  password?: string | null;
  new_password?: string | null;
}

export interface AdminSetPasswordResponse {
  message: string;
  user_id: string;
  email: string;
}

export interface BannerResponse {
  id: string;
  title: string;
  image_url: string;
  target_url: string | null;
  display_order: number;
  is_active: boolean;
  created_at: string;
}

export interface BannerCreate {
  title: string;
  image_url: string;
  target_url?: string | null;
  display_order?: number;
  is_active?: boolean;
}

export interface RefundOverrideRequest {
  payment_id: string;
  amount: number;
  reason: string;
}

export interface RefundOverrideResponse {
  refund_transaction_id: string;
  payment_id: string;
  amount: number;
  status: string;
  reason: string;
  processed_at: string;
}

export interface PaymentTransactionResponse {
  id: string;
  payment_id?: string;
  transaction_type: string;
  amount: number;
  status: string;
  provider_reference?: string | null;
  created_at: string;
}

export interface PaymentResponse {
  id: string;
  order_id: string;
  customer_profile_id: string;
  amount: number;
  currency: string;
  created_at: string;
  transactions: PaymentTransactionResponse[];
}
