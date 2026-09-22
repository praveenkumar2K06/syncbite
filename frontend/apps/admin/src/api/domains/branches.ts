import { apiClient } from "../client";
import {
  getBranchesApi as sharedGetBranchesApi,
  toggleBranchStatusApi as sharedToggleBranchStatusApi,
  createBranchApi as sharedCreateBranchApi,
  updateBranchApi as sharedUpdateBranchApi,
  deleteBranchApi as sharedDeleteBranchApi,
  type Branch,
  type BranchCreateRequest,
  type BranchUpdateRequest,
} from "@syncbite/shared";

export async function getBranchesApi(): Promise<Branch[]> {
  return sharedGetBranchesApi(apiClient, { limit: 100 });
}

export async function toggleBranchStatusApi(branchId: string, isActive: boolean): Promise<Branch> {
  return sharedToggleBranchStatusApi(apiClient, branchId, isActive);
}

export async function createBranchApi(payload: BranchCreateRequest): Promise<Branch> {
  return sharedCreateBranchApi(apiClient, payload);
}

export async function updateBranchApi(
  branchId: string,
  payload: BranchUpdateRequest,
): Promise<Branch> {
  return sharedUpdateBranchApi(apiClient, branchId, payload);
}

export async function deleteBranchApi(branchId: string): Promise<void> {
  return sharedDeleteBranchApi(apiClient, branchId);
}
