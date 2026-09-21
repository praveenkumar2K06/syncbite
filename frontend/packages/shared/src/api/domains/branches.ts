import type { ApiClientInstance } from "../client";
import type {
  Branch,
  Brand,
  Menu,
  BranchManagerCreateRequest,
  BranchManagerResponse,
} from "../../types";

export async function getBranchesApi(
  client: ApiClientInstance,
  options?: { limit?: number },
): Promise<Branch[]> {
  const limit = options?.limit ?? 100;
  return client<Branch[]>(`/branches?limit=${limit}`);
}

export async function listBranchesApi(
  client: ApiClientInstance,
  brandId?: string | null,
): Promise<Branch[]> {
  const query = new URLSearchParams();
  if (brandId) query.set("brand_id", brandId);
  query.set("limit", "100");
  const qs = query.toString();
  return client<Branch[]>(`/branches${qs ? `?${qs}` : ""}`);
}

export async function getBranchByIdApi(
  client: ApiClientInstance,
  branchId: string,
): Promise<Branch> {
  return client<Branch>(`/branches/${branchId}`);
}

export async function getBrandsApi(client: ApiClientInstance): Promise<Brand[]> {
  return client<Brand[]>("/brands");
}

export async function getBrandByIdApi(client: ApiClientInstance, brandId: string): Promise<Brand> {
  return client<Brand>(`/brands/${brandId}`);
}

export async function getBranchMenuApi(client: ApiClientInstance, branchId: string): Promise<Menu> {
  return client<Menu>(`/branches/${branchId}/menu`);
}

export interface BranchUpdateRequest {
  name?: string;
  address_text?: string;
  latitude?: number | null;
  longitude?: number | null;
  opening_time?: string;
  closing_time?: string;
  is_active?: boolean;
}

export async function updateBranchApi(
  client: ApiClientInstance,
  branchId: string,
  payload: BranchUpdateRequest,
): Promise<Branch> {
  return client<Branch>(`/branches/${branchId}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export async function setBranchOpenApi(
  client: ApiClientInstance,
  branchId: string,
  isActive: boolean,
): Promise<Branch> {
  return client<Branch>(`/branches/${branchId}/status`, {
    method: "PATCH",
    body: JSON.stringify({ is_active: isActive }),
  });
}

export const toggleBranchStatusApi = setBranchOpenApi;

export interface BranchCreateRequest {
  brand_id: string;
  name: string;
  address_text: string;
  latitude?: number | null;
  longitude?: number | null;
  is_active?: boolean;
  opening_time?: string;
  closing_time?: string;
}

export async function createBranchApi(
  client: ApiClientInstance,
  payload: BranchCreateRequest,
): Promise<Branch> {
  return client<Branch>("/branches", {
    method: "POST",
    body: JSON.stringify({
      brand_id: payload.brand_id,
      name: payload.name.trim(),
      address_text: payload.address_text.trim(),
      latitude: payload.latitude ?? null,
      longitude: payload.longitude ?? null,
      opening_time: payload.opening_time || "08:00:00",
      closing_time: payload.closing_time || "23:00:00",
      is_active: payload.is_active ?? true,
    }),
  });
}

export async function deleteBranchApi(client: ApiClientInstance, branchId: string): Promise<void> {
  await client<void>(`/branches/${branchId}`, {
    method: "DELETE",
  });
}

export async function getBranchManagersApi(
  client: ApiClientInstance,
  branchId?: string,
): Promise<BranchManagerResponse[]> {
  const query = branchId ? `?branch_id=${encodeURIComponent(branchId)}` : "";
  return client<BranchManagerResponse[]>(`/admin/branch-managers${query}`);
}

export async function createBranchManagerAccountApi(
  client: ApiClientInstance,
  payload: BranchManagerCreateRequest,
): Promise<BranchManagerResponse> {
  return client<BranchManagerResponse>("/admin/branch-managers", {
    method: "POST",
    body: JSON.stringify({
      email: payload.email.trim().toLowerCase(),
      password: payload.password,
      branch_id: payload.branch_id,
    }),
  });
}

export async function assignBranchManagerApi(
  client: ApiClientInstance,
  userId: string,
  branchId: string,
): Promise<BranchManagerResponse> {
  return client<BranchManagerResponse>(
    `/admin/branch-managers/${encodeURIComponent(userId)}/branch`,
    {
      method: "PUT",
      body: JSON.stringify({
        branch_id: branchId,
      }),
    },
  );
}

export async function createBranchManagerApi(
  client: ApiClientInstance,
  payload: {
    branch_id?: string;
    branch_name: string;
    email: string;
    password: string;
    role?: string;
  },
): Promise<{ success: boolean; email: string; password: string; role: string; user_id?: string }> {
  if (payload.branch_id && (!payload.role || payload.role === "BranchManager")) {
    try {
      const res = await createBranchManagerAccountApi(client, {
        email: payload.email,
        password: payload.password,
        branch_id: payload.branch_id,
      });
      return {
        success: true,
        email: res.email,
        password: payload.password,
        role: res.role,
        user_id: res.user_id,
      };
    } catch {
      // Fall through to fallback
    }
  }

  const targetRole = payload.role || "BranchManager";
  try {
    const regRes = await client<{
      user: { id: string; email: string; role: string };
    }>("/auth/register", {
      method: "POST",
      body: JSON.stringify({
        email: payload.email.trim().toLowerCase(),
        password: payload.password,
        role: targetRole,
      }),
    });
    return {
      success: true,
      email: regRes.user.email,
      password: payload.password,
      role: regRes.user.role,
      user_id: regRes.user.id,
    };
  } catch {
    const res = await client<{
      user_id: string;
      email: string;
      role: string;
    }>("/admin/set-password", {
      method: "POST",
      body: JSON.stringify({
        email: payload.email.trim().toLowerCase(),
        password: payload.password,
      }),
    });
    return {
      success: true,
      email: res.email,
      password: payload.password,
      role: targetRole,
      user_id: res.user_id,
    };
  }
}
