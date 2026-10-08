import { isPendingOrder, type DashboardMetrics, type OrderVM } from "@/lib/portal";
import { cn } from "@/lib/utils";
import { usePortal } from "@/context/PortalContext";
import { Badge } from "@/components/ui/badge";
import { MetricBlock, type MetricBlockProps } from "@/components/home/MetricBlock";
import { MerchantManagementCards } from "@/components/home/MerchantManagementCards";
import { NoBranchAlert } from "@/components/home/NoBranchAlert";
import { ActiveOrdersBanner } from "@/components/home/ActiveOrdersBanner";
import { MetricsOverviewGrid } from "@/components/home/MetricsOverviewGrid";
import { StoreStatusCard } from "@/components/home/StoreStatusCard";
import { RecentOrdersCard } from "@/components/home/RecentOrdersCard";
import { QuickActionsHub } from "@/components/home/QuickActionsHub";

export { MetricBlock };
export type { MetricBlockProps };

export interface HomeScreenProps {
  isOpen: boolean;
  onToggle: () => void;
  orders: OrderVM[];
  metrics: DashboardMetrics;
}

export default function HomeScreen({ isOpen, onToggle, orders, metrics }: HomeScreenProps) {
  const { isMerchantOwner, ownedBranches, branch, branchId, loadPortal } = usePortal();
  const activeCount = metrics.pending;
  const recent = orders.filter((o) => isPendingOrder(o.backendStatus)).slice(0, 5);

  return (
    <div className="flex-1 min-h-0 overflow-y-auto bg-background">
      <div className="max-w-7xl mx-auto w-full p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Top Header Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground m-0">
                {isMerchantOwner ? "Merchant Management Center" : "Kitchen Dashboard"}
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              {isMerchantOwner
                ? "Executive management controls for finances, brands, subscription, and campus outlet operations."
                : "Live operational overview, order queue, and menu shortcuts."}
            </p>
          </div>
          {branch && (
            <div className="flex items-center gap-2.5">
              <Badge
                variant="outline"
                className={cn(
                  "h-7 px-3 text-xs font-semibold gap-1.5",
                  isOpen
                    ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                    : "border-muted-foreground/30 bg-muted text-muted-foreground",
                )}
              >
                <span
                  className={cn(
                    "w-2 h-2 rounded-full",
                    isOpen ? "bg-emerald-500 animate-pulse" : "bg-muted-foreground",
                  )}
                />
                {isOpen ? "Store Open" : "Store Closed"}
              </Badge>
            </div>
          )}
        </div>

        {/* Executive Management Controls for MerchantOwner */}
        {isMerchantOwner && (
          <MerchantManagementCards
            ownedBranches={ownedBranches}
            branchId={branchId}
            currentBranchName={branch?.name}
            onSelectBranch={loadPortal}
          />
        )}

        {/* If no branch is currently loaded */}
        {!branch ? (
          <NoBranchAlert ownedBranches={ownedBranches} onSelectBranch={loadPortal} />
        ) : (
          <>
            {isMerchantOwner && (
              <div className="flex items-center justify-between pt-2">
                <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground m-0">
                  Live Operations - {branch.name}
                </h2>
                <span className="text-xs text-muted-foreground">
                  Real-time metrics for selected outlet
                </span>
              </div>
            )}

            {/* Orders alert banner if pending orders exist */}
            <ActiveOrdersBanner activeCount={activeCount} />

            {/* Metrics Grid — 6 Overview Blocks */}
            <MetricsOverviewGrid metrics={metrics} />

            {/* 2-Column Responsive Dashboard Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column (Main Section: Store State & Orders) */}
              <div className="lg:col-span-7 xl:col-span-8 flex flex-col gap-6">
                <StoreStatusCard isOpen={isOpen} onToggle={onToggle} />
                <RecentOrdersCard orders={recent} />
              </div>

              {/* Right Column (Quick Actions & Hub) */}
              <div className="lg:col-span-5 xl:col-span-4 flex flex-col gap-6">
                <QuickActionsHub />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
