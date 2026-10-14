import { useState, useEffect, useCallback, useMemo } from "react";
import { getMyNotificationsApi, toUserMessage, type NotificationLog } from "@/api";
import { usePortal } from "@/context/PortalContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { HugeiconsIcon } from "@hugeicons/react";
import { BellRingIcon, RefreshCwIcon, CheckmarkCircle02Icon } from "@hugeicons/core-free-icons";
import {
  NotificationItemCard,
  getEventMeta,
  type NotificationFilter,
} from "@/components/notifications/NotificationItemCard";

const FILTER_TABS: Array<{ id: NotificationFilter; label: string }> = [
  { id: "all", label: "All Alerts" },
  { id: "orders", label: "Orders & Delivery" },
  { id: "stock", label: "Inventory & Stock" },
  { id: "billing", label: "Billing & Compliance" },
  { id: "system", label: "System Announcements" },
];

export default function NotificationsScreen() {
  const { showToast } = usePortal();
  const [notifications, setNotifications] = useState<NotificationLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<NotificationFilter>("all");
  const [readIds, setReadIds] = useState<Set<string>>(new Set());

  const loadNotifications = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getMyNotificationsApi();
      setNotifications(data);
    } catch (err) {
      showToast(toUserMessage(err), "error");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    void loadNotifications();
  }, [loadNotifications]);

  const markAllRead = () => {
    const all = new Set(notifications.map((n) => n.id));
    setReadIds(all);
    showToast("All notifications marked as read.");
  };

  const markRead = (id: string) => {
    setReadIds((prev) => new Set([...prev, id]));
  };

  const filtered = useMemo(() => {
    return notifications.filter((n) => {
      if (filter === "all") return true;
      const meta = getEventMeta(n.subject, n.body);
      return meta.type === filter;
    });
  }, [notifications, filter]);

  const unreadCount = notifications.filter((n) => !readIds.has(n.id)).length;

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-background">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-primary/10 text-primary">
              <HugeiconsIcon icon={BellRingIcon} className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                  Notifications
                </h1>
                {unreadCount > 0 && (
                  <Badge variant="destructive" className="text-xs h-5 px-1.5 font-bold">
                    {unreadCount} New
                  </Badge>
                )}
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Alerts for incoming orders, cancellations, low stock and platform updates
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={loadNotifications}
              className="gap-1.5 text-xs"
            >
              <HugeiconsIcon icon={RefreshCwIcon} className="w-3.5 h-3.5" />
              Refresh
            </Button>
            {unreadCount > 0 && (
              <Button variant="outline" size="sm" onClick={markAllRead} className="gap-1.5 text-xs">
                <HugeiconsIcon icon={CheckmarkCircle02Icon} className="w-3.5 h-3.5" />
                Mark all read
              </Button>
            )}
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-1.5">
          {FILTER_TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors border ${
                filter === tab.id
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-muted/40 text-muted-foreground border-border hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Notifications List */}
        {loading ? (
          <div className="p-12 text-center text-sm text-muted-foreground flex items-center justify-center gap-2">
            <HugeiconsIcon icon={RefreshCwIcon} className="w-4 h-4 animate-spin" />
            Loading notifications…
          </div>
        ) : filtered.length === 0 ? (
          <Card className="border-dashed p-12 text-center">
            <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3 text-muted-foreground">
              <HugeiconsIcon icon={BellRingIcon} className="w-6 h-6" />
            </div>
            <h3 className="font-semibold text-base text-foreground">No notifications found</h3>
            <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
              You are all caught up! Orders, stock updates and platform messages will appear here.
            </p>
          </Card>
        ) : (
          <div className="space-y-3">
            {filtered.map((item) => (
              <NotificationItemCard
                key={item.id}
                item={item}
                isRead={readIds.has(item.id)}
                onMarkRead={markRead}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
