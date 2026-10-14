import { useState, useCallback } from "react";
import { updateBranchApi, toUserMessage } from "@/api";
import { fromTimeInput, mapBranch, type BranchVM } from "@/lib/portal";
import type { BranchSettingsPatch } from "@/types";

export interface UseBranchSettingsOptions {
  branchId: string | null;
  branch?: BranchVM | null;
  onBranchUpdated?: (updated: BranchVM) => void;
  showToast?: (msg: string, type?: "success" | "error") => void;
}

export function useBranchSettings({
  branchId,
  branch: _branch,
  onBranchUpdated,
  showToast,
}: UseBranchSettingsOptions) {
  const [savingSettings, setSavingSettings] = useState(false);

  const handleSaveSettings = useCallback(
    async (patch: BranchSettingsPatch) => {
      if (!branchId) {
        showToast?.("No outlet ID set for this portal.", "error");
        return;
      }
      setSavingSettings(true);
      try {
        const updated = await updateBranchApi(branchId, {
          name: patch.name.trim(),
          opening_time: fromTimeInput(patch.openingTime),
          closing_time: fromTimeInput(patch.closingTime),
          is_active: patch.isOpen,
        });
        const mapped = mapBranch(updated);
        onBranchUpdated?.(mapped);
        showToast?.("Settings saved.");
      } catch (err) {
        showToast?.(toUserMessage(err), "error");
      } finally {
        setSavingSettings(false);
      }
    },
    [branchId, onBranchUpdated, showToast],
  );

  return {
    savingSettings,
    handleSaveSettings,
  };
}

export default useBranchSettings;
