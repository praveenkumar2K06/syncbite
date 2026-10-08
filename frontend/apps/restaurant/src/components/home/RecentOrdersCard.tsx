import { useNavigate } from "react-router-dom";
import type { OrderVM } from "@/lib/portal";
import { formatMoney } from "@/lib/portal";
import Pill from "@/components/common/Pill";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { HugeiconsIcon } from "@hugeicons/react";
import { Invoice01Icon, ArrowRight01Icon } from "@hugeicons/core-free-icons";

interface RecentOrdersCardProps {
  orders: OrderVM[];
}

export function RecentOrdersCard({ orders }: RecentOrdersCardProps) {
  const navigate = useNavigate();

  return (
    <Card className="shadow-2xs border-border bg-card overflow-hidden">
      <CardHeader className="p-4 sm:p-5 border-b border-border/60 flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-base font-bold text-foreground flex items-center gap-2">
            Recent Kitchen Orders
            {orders.length > 0 && (
              <Badge variant="secondary" className="h-5 px-1.5 text-xs font-semibold">
                {orders.length}
              </Badge>
            )}
          </CardTitle>
          <CardDescription className="text-xs text-muted-foreground">
            Active orders queued for kitchen preparation
          </CardDescription>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/orders", { viewTransition: true })}
          className="h-8 text-xs font-semibold gap-1 text-primary hover:text-primary"
        >
          View All Orders
          <HugeiconsIcon icon={ArrowRight01Icon} strokeWidth={2} className="w-3.5 h-3.5" />
        </Button>
      </CardHeader>

      <CardContent className="p-0">
        {orders.length === 0 ? (
          <div className="py-12 px-4 flex flex-col items-center justify-center text-center text-muted-foreground">
            <div className="p-3 rounded-full bg-muted/60 mb-2.5">
              <HugeiconsIcon
                icon={Invoice01Icon}
                strokeWidth={1.5}
                className="w-8 h-8 opacity-60"
              />
            </div>
            <p className="text-sm font-semibold text-foreground m-0">No active orders</p>
            <p className="text-xs text-muted-foreground mt-0.5 max-w-xs">
              All incoming student orders have been fulfilled or your kitchen queue is currently
              clear.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border/60">
            {orders.map((o) => (
              <div
                key={o.id}
                onClick={() => navigate("/orders")}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 transition-colors hover:bg-muted/40 cursor-pointer"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-foreground tracking-tight">
                      {o.displayId}
                    </span>
                    <Pill status={o.status} />
                    <span className="text-xs text-muted-foreground">· {o.customer}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 truncate">
                    {o.items.map((i) => `${i.qty}× ${i.name}`).join(", ")}
                  </p>
                </div>
                <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                  <span className="text-xs text-muted-foreground">{o.time}</span>
                  <span className="text-sm font-bold text-foreground">{formatMoney(o.total)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
