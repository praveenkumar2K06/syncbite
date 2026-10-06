import type { MerchantRecord } from "@/api";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Tick02Icon,
  AlertCircleIcon,
  Clock01Icon,
  Store01Icon,
  LegalDocument01Icon,
  Coins01Icon,
  Copy01Icon,
} from "@hugeicons/core-free-icons";

interface MerchantProfileViewProps {
  merchant: MerchantRecord;
  userEmail?: string | null;
  onEdit: () => void;
  onCopy: (text: string, label: string) => void;
}

export function getStatusBadge(status: string) {
  const s = status.toUpperCase();
  if (s === "APPROVED" || s === "ACTIVE" || s === "VERIFIED") {
    return (
      <Badge className="bg-emerald-600 hover:bg-emerald-700 text-white gap-1 text-xs">
        <HugeiconsIcon icon={Tick02Icon} className="w-3.5 h-3.5" />
        Approved & Verified
      </Badge>
    );
  }
  if (s === "REJECTED") {
    return (
      <Badge variant="destructive" className="gap-1 text-xs">
        <HugeiconsIcon icon={AlertCircleIcon} className="w-3.5 h-3.5" />
        Application Rejected
      </Badge>
    );
  }
  if (s === "SUSPENDED") {
    return (
      <Badge variant="destructive" className="gap-1 text-xs">
        <HugeiconsIcon icon={AlertCircleIcon} className="w-3.5 h-3.5" />
        Account Suspended
      </Badge>
    );
  }
  return (
    <Badge className="bg-amber-500 hover:bg-amber-600 text-white gap-1 text-xs">
      <HugeiconsIcon icon={Clock01Icon} className="w-3.5 h-3.5" />
      Pending Verification
    </Badge>
  );
}

export function MerchantProfileView({
  merchant,
  userEmail,
  onEdit,
  onCopy,
}: MerchantProfileViewProps) {
  return (
    <div className="space-y-6">
      {/* Status overview banner */}
      <Card className="border-border">
        <CardContent className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-bold text-foreground">{merchant.business_name}</h2>
              {getStatusBadge(merchant.status)}
            </div>
            <p className="text-xs text-muted-foreground">
              Legal Entity:{" "}
              <span className="font-medium text-foreground">{merchant.legal_entity_name}</span>
            </p>
          </div>
          <div className="flex items-center gap-3 bg-muted/60 p-2.5 rounded-lg border border-border/60">
            <div className="text-right">
              <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
                Merchant ID
              </p>
              <p className="font-mono text-xs font-semibold text-foreground">
                {merchant.id.slice(0, 13)}…
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon-xs"
              onClick={() => onCopy(merchant.id, "Merchant ID")}
              title="Copy full Merchant ID"
            >
              <HugeiconsIcon icon={Copy01Icon} className="w-3.5 h-3.5 text-muted-foreground" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {merchant.status.toUpperCase() === "REJECTED" && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-5 text-sm space-y-3">
          <div className="flex items-center gap-2 text-red-700 dark:text-red-400 font-bold">
            <HugeiconsIcon icon={AlertCircleIcon} className="w-5 h-5" />
            Application Requires Attention
          </div>
          <p className="text-xs text-muted-foreground">
            Your merchant onboarding application was rejected by the compliance review team. Please
            update your GSTIN, FSSAI license, or legal documents and resubmit.
          </p>
          <Button
            size="sm"
            onClick={onEdit}
            className="bg-red-600 hover:bg-red-700 text-white font-semibold text-xs"
          >
            Resubmit Application Details
          </Button>
        </div>
      )}

      {/* Profile Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Business & Legal Identity */}
        <Card className="border-border">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <HugeiconsIcon icon={Store01Icon} className="w-4 h-4 text-primary" />
              <CardTitle className="text-sm font-bold">Business & Legal Identity</CardTitle>
            </div>
            <CardDescription className="text-xs">
              Registered entity information recognized on invoices
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3.5 text-xs">
            <div>
              <Label className="text-[11px] text-muted-foreground">Trade / Business Name</Label>
              <p className="font-medium text-foreground mt-0.5">{merchant.business_name}</p>
            </div>
            <Separator />
            <div>
              <Label className="text-[11px] text-muted-foreground">Legal Entity Name</Label>
              <p className="font-medium text-foreground mt-0.5">{merchant.legal_entity_name}</p>
            </div>
            <Separator />
            <div>
              <Label className="text-[11px] text-muted-foreground">Registered Account Email</Label>
              <p className="font-medium text-foreground mt-0.5">{userEmail || "—"}</p>
            </div>
            <Separator />
            <div>
              <Label className="text-[11px] text-muted-foreground">Account Created</Label>
              <p className="font-medium text-muted-foreground mt-0.5">
                {new Date(merchant.created_at).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Statutory Compliance & Tax */}
        <Card className="border-border">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <HugeiconsIcon icon={LegalDocument01Icon} className="w-4 h-4 text-primary" />
              <CardTitle className="text-sm font-bold">Regulatory & Tax Compliance</CardTitle>
            </div>
            <CardDescription className="text-xs">
              Food safety license and tax identifiers
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3.5 text-xs">
            <div>
              <div className="flex items-center justify-between">
                <Label className="text-[11px] text-muted-foreground">FSSAI License Number</Label>
                <Badge
                  variant="outline"
                  className="text-[10px] text-emerald-600 border-emerald-300"
                >
                  14-digit
                </Badge>
              </div>
              <p className="font-mono font-medium text-foreground mt-0.5">
                {merchant.fssai_license_number || "—"}
              </p>
            </div>
            <Separator />
            <div>
              <div className="flex items-center justify-between">
                <Label className="text-[11px] text-muted-foreground">
                  GSTIN (Goods and Services Tax)
                </Label>
                {merchant.gstin ? (
                  <Badge variant="outline" className="text-[10px] text-blue-600 border-blue-300">
                    Registered
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-[10px] text-muted-foreground">
                    Not Provided
                  </Badge>
                )}
              </div>
              <p className="font-mono font-medium text-foreground mt-0.5">
                {merchant.gstin || "Not provided"}
              </p>
            </div>
            <Separator />
            <div>
              <Label className="text-[11px] text-muted-foreground">Verification Authority</Label>
              <p className="font-medium text-foreground mt-0.5">
                SyncBite Food Safety & Compliance Board
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Settlement & Bank Account */}
        <Card className="border-border md:col-span-2">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <HugeiconsIcon icon={Coins01Icon} className="w-4 h-4 text-primary" />
              <CardTitle className="text-sm font-bold">Payout & Settlement Bank Details</CardTitle>
            </div>
            <CardDescription className="text-xs">
              Automated payouts and platform commission deductions are routed through this account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="p-3 rounded-lg bg-muted/40 border border-border/50">
                <Label className="text-[11px] text-muted-foreground">Bank Account Number</Label>
                <p className="font-mono font-semibold text-foreground text-sm mt-1">
                  {merchant.bank_account_number ? (
                    `•••• •••• ${merchant.bank_account_number.slice(-4)}`
                  ) : (
                    <span className="text-muted-foreground font-normal">Not configured</span>
                  )}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-muted/40 border border-border/50">
                <Label className="text-[11px] text-muted-foreground">IFSC Code</Label>
                <p className="font-mono font-semibold text-foreground text-sm mt-1">
                  {merchant.bank_ifsc_code || (
                    <span className="text-muted-foreground font-normal">—</span>
                  )}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-muted/40 border border-border/50">
                <Label className="text-[11px] text-muted-foreground">Settlement Cycle</Label>
                <p className="font-semibold text-emerald-600 text-sm mt-1">T + 1 Daily Automated</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
