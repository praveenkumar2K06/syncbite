import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  PlusSignIcon,
  Restaurant01Icon,
  Invoice01Icon,
  Package01Icon,
  Coins01Icon,
  Settings01Icon,
  ArrowRight01Icon,
} from "@hugeicons/core-free-icons";
import { usePortal } from "@/context/PortalContext";

export function QuickActionsHub() {
  const navigate = useNavigate();
  const { isMerchantOwner } = usePortal();

  return (
    <Card className="shadow-2xs border-border bg-card">
      <CardHeader className="p-4 sm:p-5 border-b border-border/60">
        <CardTitle className="text-base font-bold text-foreground">Quick Actions</CardTitle>
        <CardDescription className="text-xs text-muted-foreground">
          Frequent shortcuts to manage your outlet
        </CardDescription>
      </CardHeader>
      <CardContent className="p-2 sm:p-3 flex flex-col gap-1">
        {/* Add Item Action */}
        <button
          type="button"
          onClick={() => navigate("/menu?add=1", { viewTransition: true })}
          className="flex items-center justify-between w-full p-3 rounded-lg text-left transition-colors hover:bg-muted/60 cursor-pointer group"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shrink-0">
              <HugeiconsIcon icon={PlusSignIcon} strokeWidth={2} className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-semibold text-foreground m-0">Add New Dish</p>
              <p className="text-[11px] text-muted-foreground m-0">
                Add a new dish to your menu catalog
              </p>
            </div>
          </div>
          <HugeiconsIcon
            icon={ArrowRight01Icon}
            strokeWidth={2}
            className="w-3.5 h-3.5 text-muted-foreground group-hover:text-foreground transition-transform group-hover:translate-x-0.5"
          />
        </button>

        {/* Manage Menu */}
        <button
          type="button"
          onClick={() => navigate("/menu", { viewTransition: true })}
          className="flex items-center justify-between w-full p-3 rounded-lg text-left transition-colors hover:bg-muted/60 cursor-pointer group"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 shrink-0">
              <HugeiconsIcon icon={Restaurant01Icon} strokeWidth={2} className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-semibold text-foreground m-0">Manage Menu</p>
              <p className="text-[11px] text-muted-foreground m-0">
                Edit prices, categories, and stock availability
              </p>
            </div>
          </div>
          <HugeiconsIcon
            icon={ArrowRight01Icon}
            strokeWidth={2}
            className="w-3.5 h-3.5 text-muted-foreground group-hover:text-foreground transition-transform group-hover:translate-x-0.5"
          />
        </button>

        {/* Orders Queue */}
        <button
          type="button"
          onClick={() => navigate("/orders", { viewTransition: true })}
          className="flex items-center justify-between w-full p-3 rounded-lg text-left transition-colors hover:bg-muted/60 cursor-pointer group"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 shrink-0">
              <HugeiconsIcon icon={Invoice01Icon} strokeWidth={2} className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-semibold text-foreground m-0">
                Kitchen Orders Board
              </p>
              <p className="text-[11px] text-muted-foreground m-0">
                View live columns or stream list mode
              </p>
            </div>
          </div>
          <HugeiconsIcon
            icon={ArrowRight01Icon}
            strokeWidth={2}
            className="w-3.5 h-3.5 text-muted-foreground group-hover:text-foreground transition-transform group-hover:translate-x-0.5"
          />
        </button>

        {/* Inventory Management */}
        <button
          type="button"
          onClick={() => navigate("/inventory", { viewTransition: true })}
          className="flex items-center justify-between w-full p-3 rounded-lg text-left transition-colors hover:bg-muted/60 cursor-pointer group"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shrink-0">
              <HugeiconsIcon icon={Package01Icon} strokeWidth={2} className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-semibold text-foreground m-0">
                Inventory & Stock
              </p>
              <p className="text-[11px] text-muted-foreground m-0">
                Manage stock levels, low-stock alerts, and restocking
              </p>
            </div>
          </div>
          <HugeiconsIcon
            icon={ArrowRight01Icon}
            strokeWidth={2}
            className="w-3.5 h-3.5 text-muted-foreground group-hover:text-foreground transition-transform group-hover:translate-x-0.5"
          />
        </button>

        {/* Financials & Payouts */}
        {isMerchantOwner && (
          <button
            type="button"
            onClick={() => navigate("/finances", { viewTransition: true })}
            className="flex items-center justify-between w-full p-3 rounded-lg text-left transition-colors hover:bg-muted/60 cursor-pointer group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shrink-0">
                <HugeiconsIcon icon={Coins01Icon} strokeWidth={2} className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs sm:text-sm font-semibold text-foreground m-0">
                  Payments & Financials
                </p>
                <p className="text-[11px] text-muted-foreground m-0">
                  View order revenue, platform take rate, and net settlements
                </p>
              </div>
            </div>
            <HugeiconsIcon
              icon={ArrowRight01Icon}
              strokeWidth={2}
              className="w-3.5 h-3.5 text-muted-foreground group-hover:text-foreground transition-transform group-hover:translate-x-0.5"
            />
          </button>
        )}

        {/* Settings */}
        <button
          type="button"
          onClick={() => navigate("/settings", { viewTransition: true })}
          className="flex items-center justify-between w-full p-3 rounded-lg text-left transition-colors hover:bg-muted/60 cursor-pointer group"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 shrink-0">
              <HugeiconsIcon icon={Settings01Icon} strokeWidth={2} className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-semibold text-foreground m-0">
                Outlet Settings
              </p>
              <p className="text-[11px] text-muted-foreground m-0">
                Opening hours, account details, and preferences
              </p>
            </div>
          </div>
          <HugeiconsIcon
            icon={ArrowRight01Icon}
            strokeWidth={2}
            className="w-3.5 h-3.5 text-muted-foreground group-hover:text-foreground transition-transform group-hover:translate-x-0.5"
          />
        </button>
      </CardContent>
    </Card>
  );
}
