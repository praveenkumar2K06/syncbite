import { useState, useEffect } from "react";
import Toggle from "@/components/common/Toggle";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { Store01Icon, Settings01Icon } from "@hugeicons/core-free-icons";
import { useNavigate } from "react-router-dom";
import { isPlatformFrozen, subscribePlatformFreeze } from "@syncbite/shared";

interface StoreStatusCardProps {
  isOpen: boolean;
  onToggle: () => void;
}

export function StoreStatusCard({ isOpen, onToggle }: StoreStatusCardProps) {
  const navigate = useNavigate();
  const [platformFreeze, setPlatformFreeze] = useState(() => isPlatformFrozen());

  useEffect(() => {
    return subscribePlatformFreeze(setPlatformFreeze);
  }, []);

  return (
    <Card className="shadow-2xs border-border bg-card">
      <CardHeader className="p-4 sm:p-5 border-b border-border/60">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <HugeiconsIcon icon={Store01Icon} strokeWidth={2} className="w-4 h-4" />
            </div>
            <div>
              <CardTitle className="text-base font-bold text-foreground flex items-center gap-2">
                <span>{isOpen ? "Accepting Orders" : "Not Accepting Orders"}</span>
                {platformFreeze && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-400 font-mono font-bold border border-rose-500/30 animate-pulse">
                    🛑 Platform Frozen
                  </span>
                )}
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
                {platformFreeze
                  ? "Admin has engaged platform emergency freeze. Student orders are currently locked campus-wide."
                  : isOpen
                    ? "Students can browse your menu and place new orders right now."
                    : "Your outlet is closed. Students cannot place orders until you toggle open."}
              </CardDescription>
            </div>
          </div>
          <Toggle on={isOpen} onChange={onToggle} />
        </div>
      </CardHeader>
      <CardContent className="p-4 sm:p-5 text-xs text-muted-foreground flex flex-wrap items-center justify-between gap-3">
        <span>Status change applies instantly across student app & order queues.</span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate("/settings", { viewTransition: true })}
          className="h-8 text-xs text-muted-foreground hover:text-foreground gap-1.5"
        >
          <HugeiconsIcon icon={Settings01Icon} strokeWidth={2} className="w-3.5 h-3.5" />
          Hours & Settings
        </Button>
      </CardContent>
    </Card>
  );
}

export default StoreStatusCard;
