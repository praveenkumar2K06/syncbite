import { useNavigate } from "react-router-dom";
import { usePortal } from "@/context/PortalContext";
import { C } from "@/constants";
import Icon from "../common/Icon";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { isPlatformFrozen } from "@syncbite/shared";

export interface HeaderProps {
  branchName: string;
  isOpen: boolean;
  isPlatformFrozen?: boolean;
}

export default function Header({
  branchName,
  isOpen,
  isPlatformFrozen: isPlatformFrozenProp,
}: HeaderProps) {
  const navigate = useNavigate();
  const { isMerchantOwner, ownedBranches, branchId, loadPortal } = usePortal();
  const isFrozen = isPlatformFrozenProp ?? isPlatformFrozen();

  return (
    <>
      <header className="z-50 desktop-topbar h-12 px-6 py-3 bg-white border-b border-border shadow-sm flex items-center justify-between">
        {/* Left side: Branch dropdown selector or branch title */}
        <div className="flex items-center gap-2.5">
          {isMerchantOwner && (
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider hidden sm:inline">
                Outlet:
              </span>
              <Select
                items={ownedBranches.map((b) => ({ value: b.id, label: b.name }))}
                value={branchId ?? undefined}
                onValueChange={(val) => {
                  if (val && val !== branchId) {
                    loadPortal(val);
                  }
                }}
              >
                <SelectTrigger className="w-full max-w-48">
                  <Icon n="branches" size={13} />
                  <SelectValue placeholder={branchName} />
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

        {/* Right side: Status badge, notifications, profile */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {isFrozen && (
            <Badge
              variant="destructive"
              className="bg-rose-950/80 text-rose-400 border border-rose-800/60 font-bold animate-pulse text-[11px]"
              title="Platform-wide emergency freeze initiated by Admin"
            >
              ⚠ FROZEN
            </Badge>
          )}

          <Badge
            variant={isOpen ? "outline" : "secondary"}
            className={
              isOpen
                ? "bg-emerald-50 text-emerald-700 border-emerald-300 font-bold dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800"
                : "text-muted-foreground font-semibold"
            }
          >
            {isOpen ? "● Open" : "○ Closed"}
          </Badge>

          <Button
            variant="outline"
            size="icon-sm"
            onClick={() => navigate("/notifications")}
            className="text-muted-foreground"
            title="Notifications"
          >
            <Icon n="bell" size={14} />
          </Button>

          <Button
            variant="outline"
            size="icon-sm"
            onClick={() => navigate("/settings")}
            className="text-muted-foreground"
            title="Account & Settings"
          >
            <Icon n="user" size={14} />
          </Button>
        </div>
      </header>

      {/* Mobile spacer */}
      <div
        style={{
          height: "max(env(safe-area-inset-top,0px),20px)",
          background: C.white,
          flexShrink: 0,
        }}
        className="mobile-topbar"
      />
    </>
  );
}
