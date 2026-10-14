import type { ReactNode } from "react";

interface StatCardProps {
  label: string;
  value: string | number;
  sub?: string;
  color: string;
  icon: ReactNode;
}

export default function StatCard({ label, value, sub, color, icon }: StatCardProps) {
  return (
    <div
      className="rounded-2xl p-5 flex flex-col gap-3 animate-fade-in transition-transform hover:scale-[1.02]"
      style={{ background: "#111827", border: "1px solid #1e2d45" }}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wider text-slate-400">{label}</span>
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ background: color, opacity: 0.85 }}
        >
          {icon}
        </div>
      </div>
      <div>
        <div className="text-2xl font-bold text-white">{value}</div>
        {sub && <div className="text-xs mt-1 text-slate-400">{sub}</div>}
      </div>
    </div>
  );
}
