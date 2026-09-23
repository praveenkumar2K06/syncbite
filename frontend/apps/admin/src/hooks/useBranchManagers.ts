import { useCallback, useRef, useState } from "react";
import {
  assignBranchManagerApi,
  createBranchManagerAccountApi,
  getBranchManagersApi,
  type BranchManagerCreateRequest,
  type BranchManagerResponse,
} from "../api/admin";
import { getErrorMessage } from "../utils/errors";

export function useBranchManagers(showToast: (msg: string, type: "success" | "error") => void) {
  const [branchManagers, setBranchManagers] = useState<BranchManagerResponse[]>([]);
  const [branchManagersLoading, setBranchManagersLoading] = useState(false);
  const requestId = useRef(0);

  const loadBranchManagers = useCallback(async () => {
    const currentRequest = ++requestId.current;
    setBranchManagersLoading(true);
    try {
      const managers = await getBranchManagersApi();
      if (currentRequest === requestId.current) setBranchManagers(managers);
    } catch {
      if (currentRequest === requestId.current) {
        showToast("Could not load branch managers.", "error");
      }
    } finally {
      if (currentRequest === requestId.current) setBranchManagersLoading(false);
    }
  }, [showToast]);

  const handleCreateBranchManager = async (payload: BranchManagerCreateRequest) => {
    try {
      const created = await createBranchManagerAccountApi(payload);
      setBranchManagers((previous) => [
        created,
        ...previous.filter((item) => item.user_id !== created.user_id),
      ]);
      showToast(`Branch Manager created for "${created.branch_name}"! ✓`, "success");
      return created;
    } catch (error) {
      showToast(getErrorMessage(error, "Failed to create branch manager."), "error");
      throw error;
    }
  };

  const handleAssignBranchManager = async (userId: string, branchId: string) => {
    try {
      const updated = await assignBranchManagerApi(userId, branchId);
      setBranchManagers((previous) => [
        updated,
        ...previous.filter((item) => item.user_id !== updated.user_id),
      ]);
      showToast(`Manager reassigned to "${updated.branch_name}"! ✓`, "success");
      return updated;
    } catch (error) {
      showToast(getErrorMessage(error, "Failed to assign branch manager."), "error");
      throw error;
    }
  };

  return {
    branchManagers,
    branchManagersLoading,
    loadBranchManagers,
    handleCreateBranchManager,
    handleAssignBranchManager,
  };
}
