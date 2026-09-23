import { useEffect } from "react";

interface ToastProps {
  msg: string;
  type?: "success" | "error" | string;
  onClose: () => void;
}

export default function Toast({ msg, type = "success", onClose }: ToastProps) {
  useEffect(() => {
    const t = setTimeout(onClose, 4000);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div
      className="fixed top-5 right-5 z-50 animate-slide-left px-5 py-4 rounded-xl flex items-center gap-3 shadow-2xl"
      style={{
        background: type === "success" ? "rgba(16,185,129,0.18)" : "rgba(244,63,94,0.18)",
        border: `1px solid ${type === "success" ? "rgba(16,185,129,0.4)" : "rgba(244,63,94,0.4)"}`,
        color: type === "success" ? "#10b981" : "#f43f5e",
        maxWidth: 420,
      }}
    >
      <span className="text-lg">{type === "success" ? "✓" : "✕"}</span>
      <span className="text-sm font-medium">{msg}</span>
      <button
        onClick={onClose}
        className="ml-auto opacity-60 hover:opacity-100 transition-opacity text-lg leading-none cursor-pointer"
      >
        ×
      </button>
    </div>
  );
}
