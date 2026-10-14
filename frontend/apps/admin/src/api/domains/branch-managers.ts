import { apiClient } from "../client";
import {
  getBranchManagersApi as sharedGetBranchManagersApi,
  createBranchManagerAccountApi as sharedCreateBranchManagerAccountApi,
  assignBranchManagerApi as sharedAssignBranchManagerApi,
  createBranchManagerApi as sharedCreateBranchManagerApi,
  type BranchManagerResponse,
  type BranchManagerCreateRequest,
} from "@syncbite/shared";

export async function getBranchManagersApi(branchId?: string): Promise<BranchManagerResponse[]> {
  return sharedGetBranchManagersApi(apiClient, branchId);
}

export async function createBranchManagerAccountApi(
  payload: BranchManagerCreateRequest,
): Promise<BranchManagerResponse> {
  return sharedCreateBranchManagerAccountApi(apiClient, payload);
}

export async function assignBranchManagerApi(
  userId: string,
  branchId: string,
): Promise<BranchManagerResponse> {
  return sharedAssignBranchManagerApi(apiClient, userId, branchId);
}

export async function createBranchManagerApi(payload: {
  branch_id?: string;
  branch_name: string;
  email: string;
  password: string;
  role?: string;
}): Promise<{ success: boolean; email: string; password: string; role: string; user_id?: string }> {
  return sharedCreateBranchManagerApi(apiClient, payload);
}
