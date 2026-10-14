import { apiClient, setTokens } from "./client";
import {
  loginApi as sharedLogin,
  registerApi as sharedRegister,
  getMeApi as sharedGetMe,
  getCustomerProfileApi as sharedGetCustomerProfile,
  updateCustomerProfileApi as sharedUpdateCustomerProfile,
} from "@syncbite/shared";

import type { BackendUser, TokenResponse, CustomerProfile } from "@syncbite/shared";

export type { BackendUser, TokenResponse, CustomerProfile };

export async function loginApi(email: string, password: string): Promise<TokenResponse> {
  return sharedLogin(apiClient, email, password);
}

export async function registerApi(
  email: string,
  password: string,
  role = "Customer",
): Promise<TokenResponse> {
  return sharedRegister(apiClient, email, password, role);
}

export async function getMeApi(): Promise<BackendUser> {
  return sharedGetMe(apiClient);
}

export async function getCustomerProfileApi(): Promise<CustomerProfile> {
  return sharedGetCustomerProfile(apiClient);
}

export async function updateCustomerProfileApi(profile: {
  full_name?: string;
  phone_number?: string;
}): Promise<CustomerProfile> {
  return sharedUpdateCustomerProfile(apiClient, profile);
}

export interface AuthResult {
  tokens: TokenResponse;
  isNew: boolean;
}

/**
 * Authenticates with the backend or creates a customer account if not yet registered.
 */
export async function authenticateOrRegister(email: string): Promise<AuthResult> {
  const cleanEmail = email.trim().toLowerCase();
  // Standard campus credential scheme for seamless SSO simulation
  const defaultPassword = "CampusStudent@2026";

  let tokens: TokenResponse;
  let isNew = false;

  try {
    // Try logging in first (existing user)
    tokens = await loginApi(cleanEmail, defaultPassword);
  } catch (err: any) {
    if (err?.status === 401 || err?.errorCode === "INVALID_CREDENTIALS") {
      // If not found / invalid credentials, register new student account
      tokens = await registerApi(cleanEmail, defaultPassword, "Customer");
      isNew = true;
    } else {
      throw err;
    }
  }

  setTokens(tokens.access_token, tokens.refresh_token);
  return { tokens, isNew };
}
