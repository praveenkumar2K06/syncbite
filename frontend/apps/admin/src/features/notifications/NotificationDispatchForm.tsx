import { Input } from "../../components/ui/input";
import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";

export type TargetType =
  | "ALL_CUSTOMERS"
  | "CUSTOMER"
  | "ALL_RESTAURANTS"
  | "RESTAURANT"
  | "PLATFORM_BROADCAST";

export type DeliveryChannel = "EMAIL" | "PUSH" | "SMS";

interface NotificationDispatchFormProps {
  targetType: TargetType;
  onTargetChange: (val: TargetType) => void;
  channel: DeliveryChannel;
  onChannelChange: (val: DeliveryChannel) => void;
  recipient: string;
  onRecipientChange: (val: string) => void;
  subject: string;
  onSubjectChange: (val: string) => void;
  body: string;
  onBodyChange: (val: string) => void;
  submitting: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

export default function NotificationDispatchForm({
  targetType,
  onTargetChange,
  channel,
  onChannelChange,
  recipient,
  onRecipientChange,
  subject,
  onSubjectChange,
  body,
  onBodyChange,
  submitting,
  onSubmit,
}: NotificationDispatchFormProps) {
  return (
    <form
      onSubmit={onSubmit}
      className="p-5 rounded-2xl flex flex-col gap-4 border border-slate-800"
      style={{ background: "#111827" }}
    >
      <div className="border-b border-slate-800 pb-3">
        <h3 className="font-bold text-white text-sm flex items-center gap-2">
          <span>✉️ Dispatch Message</span>
        </h3>
        <p className="text-[11px] text-slate-400 mt-0.5">
          Target students, merchants, or broadcast across campus.
        </p>
      </div>

      <div className="flex flex-col gap-3 text-xs">
        {/* Audience selector */}
        <div>
          <label className="text-slate-400 font-medium block mb-1">Target Audience</label>
          <Select value={targetType} onValueChange={(value) => onTargetChange(value as TargetType)}>
            <SelectTrigger className="w-full px-3 py-2 rounded-xl text-xs outline-none">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="PLATFORM_BROADCAST">📢 Platform-Wide Broadcast</SelectItem>
              <SelectItem value="ALL_CUSTOMERS">👥 All Registered Students</SelectItem>
              <SelectItem value="CUSTOMER">👤 Single Student Customer</SelectItem>
              <SelectItem value="ALL_RESTAURANTS">🍽️ All Restaurant Managers</SelectItem>
              <SelectItem value="RESTAURANT">📍 Specific Restaurant Branch</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Delivery Channel */}
        <div>
          <label className="text-slate-400 font-medium block mb-1">Delivery Channel</label>
          <div className="grid grid-cols-3 gap-2">
            {(["EMAIL", "PUSH", "SMS"] as const).map((ch) => (
              <button
                type="button"
                key={ch}
                onClick={() => onChannelChange(ch)}
                className={`py-1.5 rounded-xl font-semibold text-xs border transition-all cursor-pointer ${
                  channel === ch
                    ? "bg-blue-600 text-white border-blue-500 shadow-sm"
                    : "bg-slate-900 text-slate-400 border-slate-800 hover:text-white"
                }`}
              >
                {ch}
              </button>
            ))}
          </div>
        </div>

        {/* Recipient */}
        <div>
          <label className="text-slate-400 font-medium block mb-1">Recipient Destination *</label>
          <Input
            type="text"
            required
            placeholder="e.g. student@vitstudent.ac.in or +91..."
            value={recipient}
            onChange={(e) => onRecipientChange(e.target.value)}
            className="w-full px-3.5 py-2 rounded-xl text-xs outline-none font-mono"
          />
        </div>

        {/* Subject */}
        <div>
          <label className="text-slate-400 font-medium block mb-1">Headline / Subject *</label>
          <Input
            type="text"
            required
            placeholder="e.g. Free Delivery Weekend on Campus"
            value={subject}
            onChange={(e) => onSubjectChange(e.target.value)}
            className="w-full px-3.5 py-2 rounded-xl text-xs outline-none"
          />
        </div>

        {/* Body */}
        <div>
          <label className="text-slate-400 font-medium block mb-1">Message Body *</label>
          <textarea
            rows={4}
            required
            placeholder="Compose notification text…"
            value={body}
            onChange={(e) => onBodyChange(e.target.value)}
            className="w-full px-3.5 py-2 rounded-xl text-xs outline-none"
          />
        </div>
      </div>

      <div className="pt-2">
        <button
          type="submit"
          disabled={submitting}
          className="w-full py-2.5 rounded-xl text-xs font-semibold text-white transition-all shadow-md cursor-pointer"
          style={{ background: "linear-gradient(135deg, #2563eb, #1d4ed8)" }}
        >
          {submitting ? "Transmitting…" : "🚀 Transmit Notification"}
        </button>
      </div>
    </form>
  );
}
