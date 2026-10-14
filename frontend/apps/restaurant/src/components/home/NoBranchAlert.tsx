import { useNavigate } from "react-router-dom";
import type { Branch } from "@/api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { Store01Icon } from "@hugeicons/core-free-icons";

interface NoBranchAlertProps {
  ownedBranches: Branch[];
  onSelectBranch: (id: string) => void;
}

export function NoBranchAlert({ ownedBranches, onSelectBranch }: NoBranchAlertProps) {
  const navigate = useNavigate();

  return (
    <Card className="shadow-2xs border-border bg-card">
      <CardContent className="p-8 text-center flex flex-col items-center justify-center max-w-md mx-auto space-y-3">
        <div className="p-3 rounded-full bg-primary/10 text-primary mb-1">
          <HugeiconsIcon icon={Store01Icon} strokeWidth={2} className="w-8 h-8" />
        </div>
        <h2 className="text-base font-bold text-foreground m-0">
          {ownedBranches.length === 0
            ? "No Outlets Configured"
            : "Select an Outlet to View Operations"}
        </h2>
        <p className="text-xs text-muted-foreground m-0">
          {ownedBranches.length === 0
            ? "Get started by adding your brand profile and opening your first physical branch outlet."
            : "Pick an outlet branch from the selector above to monitor live kitchen queues, dish inventory, and orders."}
        </p>
        <div className="flex items-center gap-2 pt-2">
          {ownedBranches.length === 0 ? (
            <>
              <Button size="sm" onClick={() => navigate("/brands")} className="text-xs">
                Create Brand
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => navigate("/branches")}
                className="text-xs"
              >
                Create Branch
              </Button>
            </>
          ) : (
            <Button
              size="sm"
              onClick={() => onSelectBranch(ownedBranches[0].id)}
              className="text-xs"
            >
              Open {ownedBranches[0].name}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
