/**
 * Branch, Merchant, and Brand Domain Types
 * Shared across Student, Restaurant, and Admin applications.
 */

export interface Branch {
  id: string;
  brand_id: string;
  name: string;
  address_text: string;
  latitude: number | null;
  longitude: number | null;
  is_active: boolean;
  opening_time: string;
  closing_time: string;
  created_at: string;
  updated_at: string;
}

export interface Brand {
  id: string;
  merchant_id: string;
  name: string;
  logo_url?: string | null;
  banner_url?: string | null;
  description?: string | null;
  cuisine_types?: string[] | null;
}

export interface Merchant {
  id: string;
  owner_user_id: string;
  business_name: string;
}

export interface MerchantRecord {
  id: string;
  owner_user_id: string;
  owner_email?: string | null;
  business_name: string;
  legal_entity_name: string;
  gstin: string | null;
  fssai_license_number: string;
  bank_account_number: string | null;
  bank_ifsc_code: string | null;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface BranchSettingsPatch {
  name: string;
  openingTime: string;
  closingTime: string;
  isOpen: boolean;
}

export interface BranchManagerResponse {
  user_id: string;
  email: string;
  role: string;
  is_active: boolean;
  branch_id: string;
  branch_name: string;
  brand_id: string;
}

export interface BranchManagerCreateRequest {
  email: string;
  password: string;
  branch_id: string;
}

export interface BranchManagerAssignRequest {
  branch_id: string;
}
