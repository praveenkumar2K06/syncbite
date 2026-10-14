/**
 * Authentication and User Identity Types
 * Shared across Student, Restaurant, and Admin applications.
 */

export type UserRole =
  | "PlatformAdmin"
  | "MerchantOwner"
  | "BranchManager"
  | "KitchenStaff"
  | "Customer";

export interface BackendUser {
  id: string;
  email: string;
  role: UserRole;
  branch_id?: string | null;
  is_active: boolean;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
  user: BackendUser;
}

/** Standard storage keys used across SyncBite frontends */
export const AUTH_STORAGE_KEYS = {
  STUDENT: {
    ACCESS_TOKEN: "sat_access_token",
    REFRESH_TOKEN: "sat_refresh_token",
    AUTH_USER: "sat_auth_user",
  },
  RESTAURANT: {
    ACCESS_TOKEN: "sat_rest_access_token",
    REFRESH_TOKEN: "sat_rest_refresh_token",
    AUTH_USER: "sat_rest_user",
    BRANCH_ID: "sat_rest_branch_id",
  },
  ADMIN: {
    ACCESS_TOKEN: "sat_admin_access",
    REFRESH_TOKEN: "sat_admin_refresh",
  },
} as const;
