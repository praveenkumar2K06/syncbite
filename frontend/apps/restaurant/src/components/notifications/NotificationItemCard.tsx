import type { NotificationLog } from "@/api";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ShoppingBag01Icon,
  Cancel01Icon,
  AlertCircleIcon,
  CreditCardIcon,
  LegalDocument01Icon,
  FlashIcon,
} from "@hugeicons/core-free-icons";

export type NotificationFilter = "all" | "orders" | "stock" | "billing" | "system";

export function getEventMeta(subject: string | null, body: string) {
  const text = `${subject || ""} ${body}`.toLowerCase();
  if (text.includes("cancelled") || text.includes("rejected")) {
    return {
      icon: Cancel01Icon,
      color: "text-destructive bg-destructive/10 border-destructive/20",
      type: "orders" as const,
    };
  }
  if (text.includes("order") || text.includes("ticket") || text.includes("prep")) {
    return {
      icon: ShoppingBag01Icon,
      color: "text-primary bg-primary/10 border-primary/20",
      type: "orders" as const,
    };
  }
  if (text.includes("stock") || text.includes("inventory") || text.includes("out of stock")) {
    return {
      icon: AlertCircleIcon,
      color: "text-amber-600 bg-amber-500/10 border-amber-500/20",
      type: "stock" as const,
    };
  }
  if (text.includes("subscription") || text.includes("invoice") || text.includes("payment")) {
    return {
      icon: CreditCardIcon,
      color: "text-blue-600 bg-blue-500/10 border-blue-500/20",
      type: "billing" as const,
    };
  }
  if (text.includes("approved") || text.includes("merchant") || text.includes("fssai")) {
    return {
      icon: LegalDocument01Icon,
      color: "text-emerald-600 bg-emerald-500/10 border-emerald-500/20",
      type: "billing" as const,
    };
  }
  return {
    icon: FlashIcon,
    color: "text-foreground bg-muted border-border",
    type: "system" as const,
  };
}

interface NotificationItemCardProps {
  item: NotificationLog;
  isRead: boolean;
  onMarkRead: (id: string) => void;
}

export function NotificationItemCard({ item, isRead, onMarkRead }: NotificationItemCardProps) {
  const meta = getEventMeta(item.subject, item.body);

  return (
    <Card
      onClick={() => onMarkRead(item.id)}
      className={`border transition-all cursor-pointer ${
        !isRead
          ? "border-primary/50 bg-primary/[0.02] shadow-2xs"
          : "border-border hover:bg-muted/20"
      }`}
    >
      <CardContent className="p-4 flex items-start gap-3.5">
        <div className={`p-2 rounded-lg border shrink-0 ${meta.color}`}>
          <HugeiconsIcon icon={meta.icon} className="w-4 h-4" />
        </div>

        <div className="flex-1 min-w-0 space-y-1">
          <div className="flex items-center justify-between gap-2">
            <h4 className="text-sm font-bold text-foreground truncate">
              {item.subject || "Platform Notification"}
            </h4>
            <span className="text-[11px] text-muted-foreground shrink-0 font-medium">
              {new Date(item.created_at).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}{" "}
              · {new Date(item.created_at).toLocaleDateString()}
            </span>
          </div>

          <p className="text-xs text-muted-foreground leading-relaxed">{item.body}</p>

          <div className="flex items-center gap-2 pt-1">
            <Badge variant="outline" className="text-[10px] text-muted-foreground uppercase">
              Channel: {item.channel}
            </Badge>
            {!isRead && (
              <span className="text-[10px] font-bold text-primary flex items-center gap-1">
                ● Unread
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
