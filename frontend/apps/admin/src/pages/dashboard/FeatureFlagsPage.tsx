import { useEffect, useState } from "react";
import { getFeatureFlagsApi, updateFeatureFlagApi, type FeatureFlag } from "../../api/admin";
import { ApiError } from "../../api/client";
import { useDashboardActions } from "../../context/DashboardContext";
import FeatureFlagsTab from "../../features/FeatureFlagsTab";

export default function FeatureFlagsPage() {
  const { showToast } = useDashboardActions();
  const [flags, setFlags] = useState<FeatureFlag[]>([]);
  const [flagsLoading, setFlagsLoading] = useState(true);

  useEffect(() => {
    getFeatureFlagsApi()
      .then(setFlags)
      .catch(() => showToast("Could not load feature flags.", "error"))
      .finally(() => setFlagsLoading(false));
  }, [showToast]);

  async function toggleFlag(flag: FeatureFlag) {
    try {
      const updated = await updateFeatureFlagApi(flag.flag_key, !flag.enabled, flag.value);
      setFlags((previous) =>
        previous.map((item) => (item.flag_key === flag.flag_key ? updated : item)),
      );
      showToast(`${flag.flag_key} ${updated.enabled ? "enabled" : "disabled"}.`, "success");
    } catch (error) {
      showToast(error instanceof ApiError ? error.message : "Flag update failed.", "error");
    }
  }

  return <FeatureFlagsTab flags={flags} flagsLoading={flagsLoading} onToggleFlag={toggleFlag} />;
}
