import { useState, useCallback, useMemo, useRef, useEffect } from "react";
import {
  getAccessToken,
  getBranchId,
  getBranchApi,
  getMeApi,
  loginApi,
  type Branch,
  logoutApi,
  resolveMyBranchIdsApi,
  onSessionExpired,
  rememberBranchId,
  setBranchOpenApi,
  toUserMessage,
  type BackendUser,
} from "@/api";
import { mapBranch, type BranchVM } from "@/lib/portal";
import type { BootState, ToastInfo } from "@/types";

export function useRestaurantPortal() {
  const [boot, setBoot] = useState<BootState>("restoring");
  const [user, setUser] = useState<BackendUser | null>(null);
  const [branch, setBranch] = useState<BranchVM | null>(null);
  const [branchId, setBranchId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [toast, setToast] = useState<ToastInfo | null>(null);
  /** Set only when the account legitimately owns more than one outlet. */
  const [ownedBranches, setOwnedBranches] = useState<Branch[]>([]);

  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const showToast = useCallback((msg: string, type?: "success" | "error") => {
    if (toastTimerRef.current) {
      clearTimeout(toastTimerRef.current);
    }
    setToast({ msg, type });
    toastTimerRef.current = setTimeout(() => setToast(null), 2600);
  }, []);

  const signOut = useCallback(() => {
    logoutApi();
    setUser(null);
    setBranch(null);
    setBranchId(null);
    setOwnedBranches([]);
    setBoot("signed-out");
  }, []);

  useEffect(() => {
    onSessionExpired(() => {
      setUser(null);
      setBranch(null);
      setBranchId(null);
      setBoot("signed-out");
    });
  }, []);

  /** Loads branch info for the configured outlet. */
  const loadPortal = useCallback(
    async (id: string) => {
      setLoading(true);
      setLoadError("");
      try {
        const branchRes = await getBranchApi(id);
        rememberBranchId(id, user?.id);
        setBranchId(id);
        setBranch(mapBranch(branchRes));
      } catch (err) {
        setLoadError(toUserMessage(err));
      } finally {
        setLoading(false);
      }
    },
    [user?.id],
  );

  /**
   * Works out which outlet the signed-in account manages.
   * If user is MerchantOwner: lists and resolves all branches under him.
   * If non-MerchantOwner: each user now has the outlet_id assigned directly.
   */
  const resolveOutlet = useCallback(async (targetUser: BackendUser): Promise<string | null> => {
    const isMerchantOwner = targetUser.role === "MerchantOwner";
    const assignedOutletId = targetUser.branch_id || null;

    if (isMerchantOwner) {
      try {
        const mine = await resolveMyBranchIdsApi(targetUser.id);
        setOwnedBranches(mine);
        if (mine.length > 0) {
          // Check if there was a previously remembered branch for this user that is still valid
          const remembered = getBranchId(targetUser.id);
          if (remembered && mine.some((b) => b.id === remembered)) {
            return remembered;
          }
          if (assignedOutletId && mine.some((b) => b.id === assignedOutletId)) {
            return assignedOutletId;
          }
          // Default to the first branch under him
          return mine[0].id;
        }
      } catch {
        // Fall through
      }
      return assignedOutletId || getBranchId(targetUser.id);
    }

    // Non-MerchantOwner: Each User now has the outlet_id assigned
    if (assignedOutletId) {
      try {
        const br = await getBranchApi(assignedOutletId);
        setOwnedBranches([br]);
      } catch {
        setOwnedBranches([]);
      }
      rememberBranchId(assignedOutletId, targetUser.id);
      return assignedOutletId;
    }

    return getBranchId(targetUser.id);
  }, []);

  // Restore an existing session on load.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!getAccessToken()) {
        setBoot("signed-out");
        return;
      }
      try {
        const me = await getMeApi();
        if (cancelled) return;
        setUser(me);
        setBoot("signed-in");
        const id = await resolveOutlet(me);
        if (id) await loadPortal(id);
      } catch {
        if (!cancelled) {
          logoutApi();
          setBoot("signed-out");
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [loadPortal, resolveOutlet]);

  const handleLogin = useCallback(
    async (email: string, password: string) => {
      const res = await loginApi(email, password);
      setUser(res.user);
      setBoot("signed-in");
      setOwnedBranches([]);
      const id = await resolveOutlet(res.user);
      if (id) await loadPortal(id);
    },
    [loadPortal, resolveOutlet],
  );

  const setOpen = useCallback(
    async (next: boolean): Promise<boolean> => {
      if (!branchId) {
        showToast("No outlet ID set for this portal.", "error");
        return false;
      }
      if (!branch) return false;
      const previous = branch;
      setBranch({ ...branch, isOpen: next });
      try {
        const updated = await setBranchOpenApi(branchId, next);
        setBranch(mapBranch(updated));
        showToast(next ? "Now accepting orders." : "Restaurant closed.");
        return true;
      } catch (err) {
        setBranch(previous);
        showToast(toUserMessage(err), "error");
        return false;
      }
    },
    [branch, branchId, showToast],
  );

  return useMemo(
    () => ({
      boot,
      user,
      isMerchantOwner: user?.role === "MerchantOwner",
      assignedOutletId: user?.branch_id || null,
      branch,
      setBranch,
      branchId,
      loading,
      loadError,
      toast,
      setToast,
      showToast,
      ownedBranches,
      signOut,
      loadPortal,
      handleLogin,
      setOpen,
    }),
    [
      boot,
      user,
      branch,
      branchId,
      loading,
      loadError,
      toast,
      showToast,
      ownedBranches,
      signOut,
      loadPortal,
      handleLogin,
      setOpen,
    ],
  );
}

export default useRestaurantPortal;
