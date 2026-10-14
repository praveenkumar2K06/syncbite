import { apiClient } from "../client";
import {
  adminSetPasswordApi as sharedAdminSetPassword,
  loginApi as sharedLogin,
} from "@syncbite/shared";

import type { AdminSetPasswordRequest, AdminSetPasswordResponse } from "@syncbite/shared";

export type { AdminSetPasswordRequest, AdminSetPasswordResponse };

export async function adminLoginApi(email: string, password: string) {
  return sharedLogin(apiClient, email, password);
}

export async function adminSetPasswordApi(
  payload: AdminSetPasswordRequest,
): Promise<AdminSetPasswordResponse> {
  return sharedAdminSetPassword(apiClient, payload);
}
