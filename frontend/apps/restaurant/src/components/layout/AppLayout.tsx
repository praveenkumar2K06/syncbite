import { useEffect, useState, type ReactNode } from "react";
import { C } from "@/constants";
import type { BranchVM } from "@/lib/portal";
import { apiClient } from "@/api";
import {
  isPlatformFrozen,
  checkPlatformFreezeApi,
  subscribePlatformFreeze,
} from "@syncbite/shared";
import Sidebar from "./Sidebar";
import Header from "./Header";
import MobileNav from "./MobileNav";
import NewOrderAlertBanner from "./NewOrderAlertBanner";

export interface AppLayoutProps {
  branch?: BranchVM | null;
  activeCount?: number;
  children: ReactNode;
}

export default function AppLayout({ branch, activeCount = 0, children }: AppLayoutProps) {
  const [platformFreeze, setPlatformFreeze] = useState(() => isPlatformFrozen());

  useEffect(() => {
    // Initial fetch from feature flags endpoint
    void checkPlatformFreezeApi(apiClient);

    const unsubscribe = subscribePlatformFreeze(setPlatformFreeze);

    // Poll feature flags periodically and on tab focus
    const interval = setInterval(() => {
      void checkPlatformFreezeApi(apiClient);
    }, 30_000);

    const onFocus = () => {
      if (!document.hidden) void checkPlatformFreezeApi(apiClient);
    };
    window.addEventListener("focus", onFocus);
    window.addEventListener("visibilitychange", onFocus);

    return () => {
      unsubscribe();
      clearInterval(interval);
      window.removeEventListener("focus", onFocus);
      window.removeEventListener("visibilitychange", onFocus);
    };
  }, []);

  return (
    <div
      style={{
        height: "100vh",
        maxHeight: "100vh",
        display: "flex",
        background: C.bg,
        overflow: "hidden",
      }}
    >
      <Sidebar isOpen={branch?.isOpen ?? false} activeCount={activeCount} />

      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minWidth: 0,
          minHeight: 0,
          height: "100%",
          overflow: "hidden",
        }}
      >
        {platformFreeze && (
          <div className="bg-rose-600 text-white px-4 py-1.5 text-xs font-bold flex items-center justify-between border-b border-rose-700 animate-pulse shrink-0">
            <div className="flex items-center gap-2">
              <span className="text-sm">🛑</span>
              <span>
                EMERGENCY PLATFORM FREEZE: Admin has paused campus ordering platform-wide. New
                student orders are locked.
              </span>
            </div>
            <span className="text-[10px] uppercase tracking-wider bg-rose-950/60 px-2 py-0.5 rounded font-mono border border-rose-400/40">
              Read-Only Operations
            </span>
          </div>
        )}

        <NewOrderAlertBanner />

        <Header
          branchName={branch?.name ?? "Merchant Management"}
          isOpen={branch?.isOpen ?? false}
          isPlatformFrozen={platformFreeze}
        />

        <main
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            minHeight: 0,
            overflow: "hidden",
          }}
        >
          {children}
        </main>

        <MobileNav activeCount={activeCount} />
      </div>
    </div>
  );
}
