import React, { useState, useEffect } from "react";
import { fmt, relTime } from "../../utils/formatters";
import type { CustomerData } from "./types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../../components/ui/dialog";

interface CustomerProfileModalProps {
  customer: CustomerData | null;
  loading?: boolean;
  onClose: () => void;
  onToggleStatus: (id: string, newStatus: "ACTIVE" | "SUSPENDED" | "FLAGGED") => void;
  onUpdateProfile?: (
    id: string,
    payload: {
      full_name?: string;
      phone_number?: string;
      is_active?: boolean;
      is_verified?: boolean;
    },
  ) => Promise<void>;
}

export default function CustomerProfileModal({
  customer,
  loading = false,
  onClose,
  onToggleStatus,
  onUpdateProfile,
}: CustomerProfileModalProps) {
  const [activeProfileTab, setActiveProfileTab] = useState<
    "profile" | "addresses" | "orders" | "payments" | "reviews"
  >("profile");

  const [isEditing, setIsEditing] = useState(false);
  const [editFullName, setEditFullName] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editIsActive, setEditIsActive] = useState(true);
  const [editIsVerified, setEditIsVerified] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (customer) {
      setEditFullName(customer.name || "");
      setEditPhone(customer.phone || "");
      setEditIsActive(customer.is_active ?? customer.status === "ACTIVE");
      setEditIsVerified(customer.is_verified ?? true);
      setIsEditing(false);
    }
  }, [customer]);

  if (!customer) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!onUpdateProfile) return;
    setIsSaving(true);
    try {
      await onUpdateProfile(customer.id, {
        full_name: editFullName.trim(),
        phone_number: editPhone.trim(),
        is_active: editIsActive,
        is_verified: editIsVerified,
      });
      setIsEditing(false);
    } catch {
      // Error handled in parent toast
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog
      open={!!customer}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent
        showCloseButton
        className="max-w-2xl bg-[#111827] text-slate-100 border border-[#1e2d45] p-6 max-h-[90vh] overflow-y-auto flex flex-col gap-4 shadow-2xl sm:max-w-2xl"
      >
        <DialogHeader className="pb-3 border-b border-slate-800 pr-6">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-base font-bold text-white shrink-0"
              style={{ background: "linear-gradient(135deg, #0ea5e9, #0284c7)" }}
            >
              {customer.name.slice(0, 1)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <DialogTitle className="text-base font-bold text-white">
                  {customer.name}
                </DialogTitle>
                {customer.is_verified && (
                  <span className="text-[10px] bg-emerald-950/80 text-emerald-400 border border-emerald-800/60 px-1.5 py-0.5 rounded font-semibold">
                    ✓ Verified
                  </span>
                )}
                {loading && (
                  <span className="text-[10px] text-sky-400 animate-pulse font-mono">
                    Syncing API details…
                  </span>
                )}
              </div>
              <DialogDescription className="text-xs text-slate-400">
                {customer.email}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Profile Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto">
          {(
            [
              { key: "profile", label: "Profile Overview", icon: "👤" },
              {
                key: "addresses",
                label: `Addresses (${customer.addresses?.length || (customer.campus_hostel ? 1 : 0)})`,
                icon: "📍",
              },
              { key: "orders", label: `Order History (${customer.orders.length})`, icon: "📦" },
              { key: "payments", label: `Payments (${customer.payments.length})`, icon: "💳" },
              { key: "reviews", label: `Reviews (${customer.reviews.length})`, icon: "⭐" },
            ] as const
          ).map((t) => (
            <button
              key={t.key}
              onClick={() => setActiveProfileTab(t.key)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer ${
                activeProfileTab === t.key
                  ? "bg-slate-800 text-white shadow-sm border border-slate-700"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <span>{t.icon}</span>
              <span>{t.label}</span>
            </button>
          ))}
        </div>

        {/* Tab: Profile Overview */}
        {activeProfileTab === "profile" && (
          <div className="flex flex-col gap-3 text-xs">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <div className="text-slate-400 font-medium">Account Status</div>
                <div
                  className={`mt-1 font-bold ${
                    customer.status === "ACTIVE" ? "text-emerald-400" : "text-rose-400"
                  }`}
                >
                  {customer.status}
                </div>
              </div>
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <div className="text-slate-400 font-medium">Total Orders</div>
                <div className="mt-1 font-bold text-white">{customer.total_orders} orders</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <div className="text-slate-400 font-medium">Total Volume</div>
                <div className="mt-1 font-bold text-white">{fmt(customer.total_spent)}</div>
              </div>
            </div>

            {/* View or Edit Customer Info */}
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="text-slate-400 font-semibold uppercase text-[10px] tracking-wider">
                  Customer & Student Information (API: /admin/customers)
                </div>
                {onUpdateProfile && !isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="text-xs text-sky-400 hover:text-sky-300 font-medium cursor-pointer"
                  >
                    ✏️ Edit Profile
                  </button>
                )}
              </div>

              {isEditing ? (
                <form onSubmit={handleSave} className="flex flex-col gap-3 mt-1">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] text-slate-400 font-medium block mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={editFullName}
                        onChange={(e) => setEditFullName(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white outline-none focus:border-sky-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-slate-400 font-medium block mb-1">
                        Phone Number
                      </label>
                      <input
                        type="text"
                        value={editPhone}
                        onChange={(e) => setEditPhone(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white outline-none focus:border-sky-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 border-t border-slate-800">
                    <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={editIsActive}
                        onChange={(e) => setEditIsActive(e.target.checked)}
                        className="rounded bg-slate-950 border-slate-700"
                      />
                      <span>Active Account (is_active)</span>
                    </label>

                    <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={editIsVerified}
                        onChange={(e) => setEditIsVerified(e.target.checked)}
                        className="rounded bg-slate-950 border-slate-700"
                      />
                      <span>Verified Status (is_verified)</span>
                    </label>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                    <button
                      type="button"
                      disabled={isSaving}
                      onClick={() => setIsEditing(false)}
                      className="px-3 py-1 rounded-lg text-xs font-semibold bg-slate-800 text-slate-300 hover:text-white cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="px-3.5 py-1 rounded-lg text-xs font-semibold bg-sky-600 hover:bg-sky-500 text-white cursor-pointer disabled:opacity-50"
                    >
                      {isSaving ? "Saving..." : "Save via PATCH API"}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-slate-400">Phone: </span>
                    <span className="text-white font-mono">{customer.phone}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Hostel / Campus Room: </span>
                    <span className="text-white">{customer.campus_hostel}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Joined: </span>
                    <span className="text-white font-mono">{relTime(customer.created_at)}</span>
                  </div>
                  {customer.updated_at && (
                    <div>
                      <span className="text-slate-400">Last Updated: </span>
                      <span className="text-white font-mono">{relTime(customer.updated_at)}</span>
                    </div>
                  )}
                  <div>
                    <span className="text-slate-400">Customer ID: </span>
                    <span className="text-slate-300 font-mono text-[11px]">{customer.id}</span>
                  </div>
                  {customer.user_id && (
                    <div>
                      <span className="text-slate-400">User ID: </span>
                      <span className="text-slate-300 font-mono text-[11px]">
                        {customer.user_id}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Account Actions */}
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
              <div>
                <div className="text-white font-semibold">Account Lifecycle Controls</div>
                <div className="text-slate-400 text-[11px]">
                  Suspend or reactivate customer accounts via PATCH /api/v1/admin/customers/
                  {customer.id}.
                </div>
              </div>
              <div className="flex items-center gap-2">
                {customer.status === "ACTIVE" ? (
                  <button
                    onClick={() => onToggleStatus(customer.id, "SUSPENDED")}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold text-rose-400 bg-rose-950/60 border border-rose-800 cursor-pointer"
                  >
                    Suspend Account
                  </button>
                ) : (
                  <button
                    onClick={() => onToggleStatus(customer.id, "ACTIVE")}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-800 cursor-pointer"
                  >
                    Reactivate Account
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Tab: Addresses */}
        {activeProfileTab === "addresses" && (
          <div className="flex flex-col gap-2">
            {customer.addresses && customer.addresses.length > 0 ? (
              customer.addresses.map((addr) => (
                <div
                  key={addr.id}
                  className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex flex-col gap-1 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-white">
                      {addr.address_line}
                      {addr.building_name ? `, ${addr.building_name}` : ""}
                    </span>
                    {addr.is_primary && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-sky-950/80 text-sky-400 border border-sky-800/60">
                        Primary Address
                      </span>
                    )}
                  </div>
                  <div className="text-slate-400 text-[11px] flex items-center gap-2">
                    <span>Zone: {addr.campus_zone}</span>
                    <span>•</span>
                    <span className="font-mono text-slate-500">ID: {addr.id}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300">
                <span className="text-slate-400">Current Campus Address Snapshot: </span>
                <span className="font-medium text-white">{customer.campus_hostel}</span>
              </div>
            )}
          </div>
        )}

        {/* Tab: Order History */}
        {activeProfileTab === "orders" && (
          <div className="flex flex-col gap-2">
            {customer.orders.length === 0 ? (
              <div className="text-slate-400 text-xs italic p-4 text-center">
                No orders recorded yet.
              </div>
            ) : (
              customer.orders.map((ord) => (
                <div
                  key={ord.id}
                  className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs"
                >
                  <div>
                    <div className="text-white font-semibold">{ord.restaurant_name}</div>
                    <div className="text-[11px] text-slate-400 font-mono">
                      Order #{ord.id} • {relTime(ord.date)}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-white font-bold">{fmt(ord.total_amount)}</div>
                    <span className="text-[10px] font-semibold text-emerald-400">{ord.status}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Tab: Payments */}
        {activeProfileTab === "payments" && (
          <div className="flex flex-col gap-2">
            {customer.payments.length === 0 ? (
              <div className="text-slate-400 text-xs italic p-4 text-center">
                No payment transactions found.
              </div>
            ) : (
              customer.payments.map((p) => (
                <div
                  key={p.id}
                  className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs"
                >
                  <div>
                    <div className="text-white font-medium">{p.method}</div>
                    <div className="text-[11px] text-slate-400 font-mono">
                      Tx: {p.id} • {relTime(p.date)}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-white font-bold">{fmt(p.amount)}</div>
                    <span className="text-[10px] font-semibold text-sky-400">{p.status}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Tab: Reviews */}
        {activeProfileTab === "reviews" && (
          <div className="flex flex-col gap-2">
            {customer.reviews.length === 0 ? (
              <div className="text-slate-400 text-xs italic p-4 text-center">
                No reviews written yet.
              </div>
            ) : (
              customer.reviews.map((r) => (
                <div
                  key={r.id}
                  className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-white">{r.restaurant_name}</span>
                    <span className="text-amber-400 font-bold">{"★".repeat(r.rating)}</span>
                  </div>
                  <p className="text-slate-300 mt-1">{r.comment}</p>
                  <div className="text-[11px] text-slate-500 font-mono mt-1">{relTime(r.date)}</div>
                </div>
              ))
            )}
          </div>
        )}

        <div className="flex justify-end pt-3 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-white cursor-pointer"
          >
            Close
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
