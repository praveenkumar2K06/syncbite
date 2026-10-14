import * as React from "react";
import { Badge } from "./badge";
import { cn } from "../../lib/utils";

export interface StatusBadgeProps {
  status: string;
  className?: string;
  label?: string;
}

export function StatusBadge({ status, className, label }: StatusBadgeProps) {
  const norm = status?.toUpperCase() || "";

  switch (norm) {
    case "APPROVED":
    case "ACTIVE":
    case "ONLINE":
      return (
        <Badge variant="approved" className={cn("gap-1 font-semibold", className)}>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
          {label || norm}
        </Badge>
      );

    case "PENDING_VERIFICATION":
    case "PENDING":
      return (
        <Badge variant="pending" className={cn("gap-1 font-semibold", className)}>
          <span className="w-1.5 h-1.5 rounded-full bg-primary inline-block animate-pulse" />
          {label || (norm === "PENDING_VERIFICATION" ? "Pending Verification" : "Pending")}
        </Badge>
      );

    case "REJECTED":
    case "OFFLINE":
    case "INACTIVE":
      return (
        <Badge variant="rejected" className={cn("gap-1 font-semibold", className)}>
          <span className="w-1.5 h-1.5 rounded-full bg-destructive inline-block" />
          {label || norm}
        </Badge>
      );

    case "SUSPENDED":
      return (
        <Badge variant="suspended" className={cn("gap-1 font-semibold", className)}>
          <span className="w-1.5 h-1.5 rounded-full bg-violet-400 inline-block" />
          {label || "Suspended"}
        </Badge>
      );

    case "DRAFT":
      return (
        <Badge variant="default" className={cn("gap-1 font-semibold", className)}>
          <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground inline-block" />
          {label || "Draft"}
        </Badge>
      );

    default:
      return (
        <Badge variant="default" className={className}>
          {label || status}
        </Badge>
      );
  }
}
