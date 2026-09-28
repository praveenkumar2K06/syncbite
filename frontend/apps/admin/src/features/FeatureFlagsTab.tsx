import { useState, type FormEvent } from "react";
import type { FeatureFlag } from "../api/admin";
import { setPlatformFreeze } from "@syncbite/shared";
import FeatureFlagHeader from "./flags/FeatureFlagHeader";
import FeatureFlagMatrix from "./flags/FeatureFlagMatrix";
import OperationalThrottlesForm from "./flags/OperationalThrottlesForm";

interface FeatureFlagsTabProps {
  flags: FeatureFlag[];
  flagsLoading: boolean;
  onToggleFlag: (flag: FeatureFlag) => void;
}

export default function FeatureFlagsTab({
  flags,
  flagsLoading,
  onToggleFlag,
}: FeatureFlagsTabProps) {
  // Operational throttles state
  const [rateLimitThreshold, setRateLimitThreshold] = useState("120");
  const [maxCheckoutConcurrency, setMaxCheckoutConcurrency] = useState("50");
  const [orderTimeoutMins, setOrderTimeoutMins] = useState("15");
  const [throttlesSaved, setThrottlesSaved] = useState(false);

  const maintenanceFlag = flags.find(
    (f) => f.flag_key === "EMERGENCY_MAINTENANCE_MODE" || f.flag_key === "maintenance_mode",
  );

  const handleSaveThrottles = (e: FormEvent) => {
    e.preventDefault();
    setThrottlesSaved(true);
    setTimeout(() => setThrottlesSaved(false), 2500);
  };

  const handleEmergencyDisable = () => {
    if (maintenanceFlag) {
      onToggleFlag({ ...maintenanceFlag, enabled: true, value: "EMERGENCY_SHUTDOWN_ADMIN" });
    } else {
      onToggleFlag({
        flag_key: "EMERGENCY_MAINTENANCE_MODE",
        enabled: true,
        value: "EMERGENCY_SHUTDOWN_ADMIN",
      });
    }
    // Also broadcast platform freeze to student and restaurant apps
    setPlatformFreeze(true);
  };

  return (
    <div className="flex flex-col gap-8 animate-fade-in max-w-4xl">
      <FeatureFlagHeader
        maintenanceFlag={maintenanceFlag}
        onEmergencyDisable={handleEmergencyDisable}
      />

      <FeatureFlagMatrix flagsLoading={flagsLoading} flags={flags} onToggleFlag={onToggleFlag} />

      <OperationalThrottlesForm
        rateLimitThreshold={rateLimitThreshold}
        onRateLimitChange={setRateLimitThreshold}
        maxCheckoutConcurrency={maxCheckoutConcurrency}
        onConcurrencyChange={setMaxCheckoutConcurrency}
        orderTimeoutMins={orderTimeoutMins}
        onTimeoutChange={setOrderTimeoutMins}
        throttlesSaved={throttlesSaved}
        onSubmit={handleSaveThrottles}
      />
    </div>
  );
}
