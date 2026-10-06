import { useState, useEffect, type ReactNode } from "react";
import type { BackendUser } from "@/api";
import { toTimeInput, type BranchVM } from "@/lib/portal";
import type { BranchSettingsPatch } from "@/types";
import Toggle from "@/components/common/Toggle";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { HugeiconsIcon } from "@hugeicons/react";
import { Logout01Icon, Store01Icon, Clock01Icon, UserIcon } from "@hugeicons/core-free-icons";
import { OrderViewModeCard } from "@/components/settings/OrderViewModeCard";
import { KitchenSoundAlertCard } from "@/components/settings/KitchenSoundAlertCard";
import { QuickManagementLinksCard } from "@/components/settings/QuickManagementLinksCard";

export interface SettingsScreenProps {
  branch?: BranchVM | null;
  user: BackendUser | null;
  onSave: (patch: BranchSettingsPatch) => Promise<void>;
  onLogout: () => void;
  saving: boolean;
}

interface SettingsRowProps {
  label: string;
  children: ReactNode;
}

function SettingsRow({ label, children }: SettingsRowProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label className="text-xs text-muted-foreground font-medium">{label}</Label>
      {children}
    </div>
  );
}

function AccountField({ label, value }: { label: string; value: string }) {
  return (
    <SettingsRow label={label}>
      <Input
        value={value || "—"}
        readOnly
        disabled
        className="bg-muted/50 cursor-default text-muted-foreground font-mono text-xs"
      />
    </SettingsRow>
  );
}

export default function SettingsScreen({
  branch,
  user,
  onSave,
  onLogout,
  saving,
}: SettingsScreenProps) {
  const [form, setForm] = useState({
    name: branch?.name ?? "",
    openTime: toTimeInput(branch?.openingTime),
    closeTime: toTimeInput(branch?.closingTime),
  });
  const [isOpen, setIsOpen] = useState(branch?.isOpen ?? false);

  useEffect(() => {
    if (branch) {
      setForm({
        name: branch.name,
        openTime: toTimeInput(branch.openingTime),
        closeTime: toTimeInput(branch.closingTime),
      });
      setIsOpen(branch.isOpen);
    }
  }, [branch]);

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((p) => ({ ...p, [k]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!branch) return;
    await onSave({
      name: form.name,
      openingTime: form.openTime,
      closingTime: form.closeTime,
      isOpen,
    });
  };

  return (
    <div className="flex-1 min-h-0 overflow-y-auto bg-background">
      <div className="max-w-6xl mx-auto w-full p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Top Header & Quick Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/80">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground m-0">
                Outlet Settings
              </h1>
              <Badge variant="outline" className="text-xs font-semibold px-2 py-0.5">
                {branch?.name ?? "No Outlet Selected"}
              </Badge>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              Configure restaurant details, operating schedule, kitchen layout, and account
              credentials.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onLogout}
              className="text-muted-foreground hover:text-destructive gap-1.5 h-9 text-xs"
            >
              <HugeiconsIcon icon={Logout01Icon} strokeWidth={2} className="w-3.5 h-3.5" />
              Sign Out
            </Button>
            <Button
              onClick={submit}
              disabled={saving || !branch}
              size="sm"
              className="h-9 min-w-28 text-xs font-semibold"
            >
              {saving ? "Saving…" : "Save Changes"}
            </Button>
          </div>
        </div>

        {/* Settings Form Grid */}
        <form onSubmit={submit} className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Restaurant Profile & Orders Display Layout (lg:col-span-7) */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            {/* Restaurant Profile Card */}
            <Card className="shadow-2xs border-border bg-card">
              <CardHeader className="p-4 sm:p-5 border-b border-border/60">
                <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <HugeiconsIcon
                    icon={Store01Icon}
                    strokeWidth={2}
                    className="w-4 h-4 text-primary"
                  />
                  Restaurant Information
                </CardTitle>
                <CardDescription className="text-xs text-muted-foreground">
                  Update your public outlet name and operating hours
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 sm:p-5 flex flex-col gap-4">
                <SettingsRow label="Restaurant Name">
                  <Input
                    value={form.name}
                    onChange={set("name")}
                    placeholder="Enter restaurant name"
                    className="text-xs sm:text-sm"
                  />
                </SettingsRow>

                <SettingsRow label="Outlet Address">
                  <Input
                    value={branch?.address || "—"}
                    readOnly
                    disabled
                    className="bg-muted/50 cursor-default text-muted-foreground text-xs sm:text-sm"
                  />
                </SettingsRow>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <SettingsRow label="Opening Time">
                    <Input
                      type="time"
                      value={form.openTime}
                      onChange={set("openTime")}
                      className="text-xs sm:text-sm"
                    />
                  </SettingsRow>
                  <SettingsRow label="Closing Time">
                    <Input
                      type="time"
                      value={form.closeTime}
                      onChange={set("closeTime")}
                      className="text-xs sm:text-sm"
                    />
                  </SettingsRow>
                </div>
              </CardContent>
            </Card>

            {/* Orders Display Layout Card */}
            <OrderViewModeCard />

            {/* Kitchen Sound Alerts Configuration Card */}
            <KitchenSoundAlertCard />
          </div>

          {/* Right Column: Order Status & Account Information (lg:col-span-5) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            {/* Operating Status Card */}
            <Card className="shadow-2xs border-border bg-card">
              <CardHeader className="p-4 sm:p-5 border-b border-border/60">
                <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <HugeiconsIcon
                    icon={Clock01Icon}
                    strokeWidth={2}
                    className="w-4 h-4 text-primary"
                  />
                  Store Operating Status
                </CardTitle>
                <CardDescription className="text-xs text-muted-foreground">
                  Control whether students can place orders right now
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 sm:p-5">
                <div className="flex items-center justify-between gap-4 p-3.5 rounded-lg border border-border bg-muted/20">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span
                        className={cn(
                          "w-2 h-2 rounded-full",
                          isOpen ? "bg-emerald-500 animate-pulse" : "bg-muted-foreground",
                        )}
                      />
                      <p className="text-xs sm:text-sm font-bold text-foreground m-0">
                        {isOpen ? "Accepting Orders" : "Closed / Paused"}
                      </p>
                    </div>
                    <p className="text-[11px] text-muted-foreground m-0">
                      {isOpen
                        ? "Students can place orders from campus app."
                        : "New order placement is currently suspended."}
                    </p>
                  </div>
                  <Toggle on={isOpen} onChange={setIsOpen} />
                </div>
              </CardContent>
            </Card>

            {/* Account & Identification Card */}
            <Card className="shadow-2xs border-border bg-card">
              <CardHeader className="p-4 sm:p-5 border-b border-border/60">
                <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <HugeiconsIcon icon={UserIcon} strokeWidth={2} className="w-4 h-4 text-primary" />
                  Account & Outlet ID
                </CardTitle>
                <CardDescription className="text-xs text-muted-foreground">
                  Credentials associated with this restaurant session
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 sm:p-5 flex flex-col gap-3.5">
                <AccountField label="Admin Email" value={user?.email ?? ""} />
                <AccountField label="User Role" value={user?.role ?? ""} />
                {user?.branch_id && (
                  <AccountField label="Assigned Branch / Outlet ID" value={user.branch_id} />
                )}
                {branch && <AccountField label="Active Branch / Outlet ID" value={branch.id} />}
              </CardContent>
            </Card>

            {/* Quick Management Links Card */}
            <QuickManagementLinksCard isMerchantOwner={user?.role === "MerchantOwner"} />

            {/* Save Card Reminder */}
            <Card className="border-border bg-muted/20 shadow-none">
              <CardContent className="p-4 flex items-center justify-between gap-3">
                <span className="text-xs text-muted-foreground">
                  Unsaved form adjustments will be lost on page reload.
                </span>
                <Button
                  type="submit"
                  disabled={saving}
                  size="sm"
                  className="font-semibold text-xs shrink-0"
                >
                  {saving ? "Saving…" : "Save Changes"}
                </Button>
              </CardContent>
            </Card>
          </div>
        </form>
      </div>
    </div>
  );
}
