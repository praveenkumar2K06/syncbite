import { useNavigate } from "react-router-dom";
import type { Branch } from "@/api";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Store01Icon,
  Money01Icon,
  Restaurant01Icon,
  Invoice01Icon,
  ArrowRight01Icon,
} from "@hugeicons/core-free-icons";

interface MerchantManagementCardsProps {
  ownedBranches: Branch[];
  branchId: string | null;
  currentBranchName?: string;
  onSelectBranch: (id: string) => void;
}

export function MerchantManagementCards({
  ownedBranches,
  branchId,
  currentBranchName,
  onSelectBranch,
}: MerchantManagementCardsProps) {
  const navigate = useNavigate();

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-border/60">
        <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Management Controls
        </span>
        {ownedBranches.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold text-muted-foreground tracking-wider hidden sm:inline">
              Operating Outlet:
            </span>
            <Select
              items={ownedBranches.map((b) => ({ value: b.id, label: b.name }))}
              value={branchId ?? undefined}
              onValueChange={(val) => {
                if (val && val !== branchId) {
                  onSelectBranch(val);
                }
              }}
            >
              <SelectTrigger className="w-full max-w-48">
                <HugeiconsIcon
                  icon={Store01Icon}
                  strokeWidth={2}
                  className="w-3.5 h-3.5 text-primary"
                />
                <SelectValue placeholder={currentBranchName} />
              </SelectTrigger>
              <SelectContent alignItemWithTrigger={true}>
                <SelectGroup>
                  <SelectLabel>Branches</SelectLabel>
                  {ownedBranches.map((item) => (
                    <SelectItem key={item.id} value={item.id}>
                      {item.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        {/* Finances */}
        <Card
          onClick={() => navigate("/finances", { viewTransition: true })}
          className="group cursor-pointer transition-all hover:border-emerald-500/50 hover:shadow-xs border-border bg-card"
        >
          <CardContent className="p-4 sm:p-5 flex flex-col justify-between h-full gap-4">
            <div className="flex items-start justify-between">
              <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <HugeiconsIcon icon={Money01Icon} strokeWidth={2} className="w-5 h-5" />
              </div>
              <Badge variant="secondary" className="text-[10px] uppercase font-bold tracking-wider">
                Financials
              </Badge>
            </div>
            <div>
              <h3 className="text-sm font-bold text-foreground group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                Finances & Settlements
              </h3>
              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                View gross revenue, platform take rate deductions, and net payout settlements.
              </p>
            </div>
            <div className="flex items-center text-xs font-semibold text-emerald-600 dark:text-emerald-400 gap-1 mt-auto pt-2 border-t border-border/50">
              <span>View Financials</span>
              <HugeiconsIcon
                icon={ArrowRight01Icon}
                strokeWidth={2}
                className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform"
              />
            </div>
          </CardContent>
        </Card>

        {/* Brands */}
        <Card
          onClick={() => navigate("/brands", { viewTransition: true })}
          className="group cursor-pointer transition-all hover:border-blue-500/50 hover:shadow-xs border-border bg-card"
        >
          <CardContent className="p-4 sm:p-5 flex flex-col justify-between h-full gap-4">
            <div className="flex items-start justify-between">
              <div className="p-2.5 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
                <HugeiconsIcon icon={Store01Icon} strokeWidth={2} className="w-5 h-5" />
              </div>
              <Badge variant="secondary" className="text-[10px] uppercase font-bold tracking-wider">
                Brands
              </Badge>
            </div>
            <div>
              <h3 className="text-sm font-bold text-foreground group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                Brand Portfolio
              </h3>
              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                Manage registered restaurant brands, cuisine categories, and brand logos.
              </p>
            </div>
            <div className="flex items-center text-xs font-semibold text-blue-600 dark:text-blue-400 gap-1 mt-auto pt-2 border-t border-border/50">
              <span>Manage Brands</span>
              <HugeiconsIcon
                icon={ArrowRight01Icon}
                strokeWidth={2}
                className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform"
              />
            </div>
          </CardContent>
        </Card>

        {/* Branches */}
        <Card
          onClick={() => navigate("/branches", { viewTransition: true })}
          className="group cursor-pointer transition-all hover:border-amber-500/50 hover:shadow-xs border-border bg-card"
        >
          <CardContent className="p-4 sm:p-5 flex flex-col justify-between h-full gap-4">
            <div className="flex items-start justify-between">
              <div className="p-2.5 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
                <HugeiconsIcon icon={Restaurant01Icon} strokeWidth={2} className="w-5 h-5" />
              </div>
              <Badge variant="secondary" className="text-[10px] uppercase font-bold tracking-wider">
                {ownedBranches.length} Outlets
              </Badge>
            </div>
            <div>
              <h3 className="text-sm font-bold text-foreground group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                Branches & Outlets
              </h3>
              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                List and configure all campus branches, opening schedules, and assigned staff.
              </p>
            </div>
            <div className="flex items-center text-xs font-semibold text-amber-600 dark:text-amber-400 gap-1 mt-auto pt-2 border-t border-border/50">
              <span>All Branches</span>
              <HugeiconsIcon
                icon={ArrowRight01Icon}
                strokeWidth={2}
                className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform"
              />
            </div>
          </CardContent>
        </Card>

        {/* Subscription */}
        <Card
          onClick={() => navigate("/subscription", { viewTransition: true })}
          className="group cursor-pointer transition-all hover:border-purple-500/50 hover:shadow-xs border-border bg-card"
        >
          <CardContent className="p-4 sm:p-5 flex flex-col justify-between h-full gap-4">
            <div className="flex items-start justify-between">
              <div className="p-2.5 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400">
                <HugeiconsIcon icon={Invoice01Icon} strokeWidth={2} className="w-5 h-5" />
              </div>
              <Badge variant="secondary" className="text-[10px] uppercase font-bold tracking-wider">
                Plan & KYC
              </Badge>
            </div>
            <div>
              <h3 className="text-sm font-bold text-foreground group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                Subscription & Plan
              </h3>
              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                Review billing tier, invoices, platform commission rates, and merchant verification.
              </p>
            </div>
            <div className="flex items-center text-xs font-semibold text-purple-600 dark:text-purple-400 gap-1 mt-auto pt-2 border-t border-border/50">
              <span>View Plan</span>
              <HugeiconsIcon
                icon={ArrowRight01Icon}
                strokeWidth={2}
                className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
