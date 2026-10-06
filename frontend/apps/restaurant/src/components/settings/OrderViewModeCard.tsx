import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useOrderViewMode } from "@/lib/orderViewSettings";
import { HugeiconsIcon } from "@hugeicons/react";
import { Layout3ColumnIcon, ListFilterIcon, Tick02Icon } from "@hugeicons/core-free-icons";

export function OrderViewModeCard() {
  const [orderViewMode, setOrderViewMode] = useOrderViewMode();

  return (
    <Card className="shadow-2xs border-border bg-card">
      <CardHeader className="p-4 sm:p-5 border-b border-border/60">
        <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
          <HugeiconsIcon
            icon={Layout3ColumnIcon}
            strokeWidth={2}
            className="w-4 h-4 text-primary"
          />
          Orders Display Layout
        </CardTitle>
        <CardDescription className="text-xs text-muted-foreground">
          Select your active kitchen display workflow preference (saved on this device)
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 sm:p-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {/* Kanban Option */}
          <button
            type="button"
            onClick={() => setOrderViewMode("kanban")}
            className={cn(
              "flex flex-col text-left p-4 rounded-xl border transition-all cursor-pointer",
              orderViewMode === "kanban"
                ? "border-primary bg-primary/5 ring-1 ring-primary/40 text-foreground"
                : "border-border bg-card hover:border-foreground/20 text-muted-foreground",
            )}
          >
            <div className="flex items-center justify-between w-full mb-2">
              <div className="flex items-center gap-2">
                <HugeiconsIcon
                  icon={Layout3ColumnIcon}
                  strokeWidth={2}
                  className={cn(
                    "w-4 h-4",
                    orderViewMode === "kanban" ? "text-primary" : "text-muted-foreground",
                  )}
                />
                <span className="text-xs font-bold text-foreground">Kitchen Kanban (Columns)</span>
              </div>
              {orderViewMode === "kanban" ? (
                <div className="p-0.5 rounded-full bg-primary text-primary-foreground">
                  <HugeiconsIcon icon={Tick02Icon} strokeWidth={2.5} className="w-3 h-3" />
                </div>
              ) : (
                <span className="w-2 h-2 rounded-full border border-border" />
              )}
            </div>
            <p className="text-[11px] leading-relaxed text-muted-foreground m-0">
              Multi-column stage board (New, In Kitchen, Ready) with direct 1-tap card buttons.
            </p>
          </button>

          {/* List Option */}
          <button
            type="button"
            onClick={() => setOrderViewMode("list")}
            className={cn(
              "flex flex-col text-left p-4 rounded-xl border transition-all cursor-pointer",
              orderViewMode === "list"
                ? "border-primary bg-primary/5 ring-1 ring-primary/40 text-foreground"
                : "border-border bg-card hover:border-foreground/20 text-muted-foreground",
            )}
          >
            <div className="flex items-center justify-between w-full mb-2">
              <div className="flex items-center gap-2">
                <HugeiconsIcon
                  icon={ListFilterIcon}
                  strokeWidth={2}
                  className={cn(
                    "w-4 h-4",
                    orderViewMode === "list" ? "text-primary" : "text-muted-foreground",
                  )}
                />
                <span className="text-xs font-bold text-foreground">Enhanced Stream (List)</span>
              </div>
              {orderViewMode === "list" ? (
                <div className="p-0.5 rounded-full bg-primary text-primary-foreground">
                  <HugeiconsIcon icon={Tick02Icon} strokeWidth={2.5} className="w-3 h-3" />
                </div>
              ) : (
                <span className="w-2 h-2 rounded-full border border-border" />
              )}
            </div>
            <p className="text-[11px] leading-relaxed text-muted-foreground m-0">
              Streamlined active order feed with item customization tags, search filter, and past
              orders archive.
            </p>
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
