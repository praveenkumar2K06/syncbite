import { C } from "@/constants";
import Icon from "./Icon";

export interface ToastProps {
  msg: string;
  type?: "success" | "error" | string;
  onClose: () => void;
}

export default function Toast({ msg, type, onClose }: ToastProps) {
  return (
    <div
      style={{
        position: "fixed",
        bottom: 70,
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 300,
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "9px 14px",
        borderRadius: 4,
        background: type === "error" ? C.red : C.navy,
        color: C.white,
        fontSize: 13,
        minWidth: 180,
        maxWidth: "90vw",
        boxShadow: "0 4px 16px rgba(0,0,0,.2)",
        animation: "up .18s ease",
      }}
    >
      <Icon n={type === "error" ? "x" : "check"} size={13} />
      <span style={{ flex: 1 }}>{msg}</span>
      <button
        onClick={onClose}
        style={{
          background: "none",
          border: "none",
          color: "rgba(255,255,255,.5)",
          cursor: "pointer",
          display: "flex",
        }}
      >
        <Icon n="x" size={12} />
      </button>
    </div>
  );
}
