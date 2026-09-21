import type { ApiClientInstance } from "../client";
import type { BackendUser, TokenResponse } from "../../types/auth";

export async function loginApi(
  client: ApiClientInstance,
  email: string,
  password: string,
): Promise<TokenResponse> {
  const data = await client<TokenResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email: email.trim().toLowerCase(), password }),
  });
  client.setTokens(data.access_token, data.refresh_token);
  return data;
}

export async function registerApi(
  client: ApiClientInstance,
  email: string,
  password: string,
  role = "Customer",
): Promise<TokenResponse> {
  const data = await client<TokenResponse>("/auth/register", {
    method: "POST",
    body: JSON.stringify({ email: email.trim().toLowerCase(), password, role }),
  });
  client.setTokens(data.access_token, data.refresh_token);
  return data;
}

export async function getMeApi(client: ApiClientInstance): Promise<BackendUser> {
  return client<BackendUser>("/auth/me");
}
