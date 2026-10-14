import { useState, useEffect, useCallback } from "react";
import { useDashboardActions } from "../../context/DashboardContext";
import {
  getAdminGamePlatformsApi,
  createAdminGamePlatformApi,
  updateAdminGamePlatformApi,
  deleteAdminGamePlatformApi,
  getAdminGameTicketsApi,
  pushAdminGameTicketOrderApi,
  cancelAdminGameTicketApi,
  type GamePlatform,
  type GameTicket,
} from "../../api/admin";
import { formatCurrency } from "@syncbite/shared";

export default function GamesPage() {
  const { showToast } = useDashboardActions();

  const [platforms, setPlatforms] = useState<GamePlatform[]>([]);
  const [tickets, setTickets] = useState<GameTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [subTab, setSubTab] = useState<"platforms" | "tickets">("platforms");
  const [busyId, setBusyId] = useState<string | null>(null);

  // Create platform form state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("CONSOLE");
  const [location, setLocation] = useState("Level 1 · Campus Arena");
  const [hourlyRate, setHourlyRate] = useState("150");
  const [totalUnits, setTotalUnits] = useState("6");
  const [description, setDescription] = useState("");
  const [featuresText, setFeaturesText] = useState("4K 120Hz, 2-4 Players");
  const [creating, setCreating] = useState(false);

  const loadAll = useCallback(async () => {
    setLoading(true);
    try {
      const [plats, ticks] = await Promise.all([
        getAdminGamePlatformsApi(),
        getAdminGameTicketsApi().catch(() => [] as GameTicket[]),
      ]);
      setPlatforms(plats);
      setTickets(ticks);
    } catch (err) {
      showToast(
        err instanceof Error ? err.message : "Failed to load Game Arena data",
        "error",
      );
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    void loadAll();
  }, [loadAll]);

  async function handleCreatePlatform(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || creating) return;
    setCreating(true);
    try {
      const units = Math.max(1, parseInt(totalUnits, 10) || 5);
      await createAdminGamePlatformApi({
        name: name.trim(),
        category,
        location: location.trim() || "Campus Arena",
        hourly_rate: Math.max(0, parseFloat(hourlyRate) || 150),
        total_units: units,
        available_units: units,
        description: description.trim(),
        features: featuresText
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        is_active: true,
      });
      showToast(`Created game platform "${name.trim()}"`, "success");
      setShowCreateModal(false);
      setName("");
      setDescription("");
      await loadAll();
    } catch (err) {
      showToast(
        err instanceof Error ? err.message : "Failed to create game platform",
        "error",
      );
    } finally {
      setCreating(false);
    }
  }

  async function handleToggleActive(platform: GamePlatform) {
    setBusyId(platform.id);
    try {
      await updateAdminGamePlatformApi(platform.id, {
        is_active: !platform.is_active,
      });
      showToast(
        `${platform.name} is now ${!platform.is_active ? "Active" : "Inactive"}`,
        "success",
      );
      await loadAll();
    } catch (err) {
      showToast(
        err instanceof Error ? err.message : "Failed to update platform",
        "error",
      );
    } finally {
      setBusyId(null);
    }
  }

  async function handleResetUnits(platform: GamePlatform) {
    setBusyId(platform.id);
    try {
      await updateAdminGamePlatformApi(platform.id, {
        available_units: platform.total_units,
      });
      showToast(`Reset all ${platform.total_units} stations for ${platform.name}`, "success");
      await loadAll();
    } catch (err) {
      showToast(
        err instanceof Error ? err.message : "Failed to reset stations",
        "error",
      );
    } finally {
      setBusyId(null);
    }
  }

  async function handleDeactivate(platform: GamePlatform) {
    setBusyId(platform.id);
    try {
      await deleteAdminGamePlatformApi(platform.id);
      showToast(`Deactivated ${platform.name}`, "success");
      await loadAll();
    } catch (err) {
      showToast(
        err instanceof Error ? err.message : "Failed to deactivate platform",
        "error",
      );
    } finally {
      setBusyId(null);
    }
  }

  async function handlePushTicketOrder(ticket: GameTicket) {
    setBusyId(ticket.id);
    try {
      await pushAdminGameTicketOrderApi(ticket.id);
      showToast(
        `Ticket ${ticket.ticket_code} completed & paired ${ticket.fulfillment_mode || "DINE_IN"} order pushed to restaurant!`,
        "success",
      );
      await loadAll();
    } catch (err) {
      showToast(
        err instanceof Error ? err.message : "Failed to push ticket order",
        "error",
      );
    } finally {
      setBusyId(null);
    }
  }

  async function handleCancelTicket(ticket: GameTicket) {
    setBusyId(ticket.id);
    try {
      await cancelAdminGameTicketApi(ticket.id);
      showToast(`Ticket ${ticket.ticket_code} cancelled`, "success");
      await loadAll();
    } catch (err) {
      showToast(
        err instanceof Error ? err.message : "Failed to cancel ticket",
        "error",
      );
    } finally {
      setBusyId(null);
    }
  }

  const activeTickets = tickets.filter((t) => t.status === "ACTIVE");
  const pairedOrdersCount = tickets.filter((t) => Boolean(t.linked_order_id)).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            🎮 Game Platforms &amp; Auto-Push Tickets
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Manage campus gaming arenas (PS5, PC, VR, Snooker, Bowling) and monitor live game
            tickets paired with end-of-game Dine-In / Takeaway restaurant orders.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => void loadAll()}
            className="px-3.5 py-2 rounded-lg text-xs font-semibold border border-border bg-card hover:bg-muted transition-colors cursor-pointer"
          >
            ↻ Refresh
          </button>
          <button
            onClick={() => setShowCreateModal((v) => !v)}
            className="px-4 py-2 rounded-lg text-xs font-bold text-white cursor-pointer"
            style={{ background: "linear-gradient(135deg, #f97316, #ea580c)" }}
          >
            + New Game Platform
          </button>
        </div>
      </div>

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="text-xs text-muted-foreground">Total Platforms</div>
          <div className="text-2xl font-bold text-foreground mt-1">{platforms.length}</div>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="text-xs text-muted-foreground">Active Game Sessions</div>
          <div className="text-2xl font-bold text-emerald-500 mt-1">{activeTickets.length}</div>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="text-xs text-muted-foreground">Total Tickets Booked</div>
          <div className="text-2xl font-bold text-foreground mt-1">{tickets.length}</div>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="text-xs text-muted-foreground">Paired Food Orders (Auto-Push)</div>
          <div className="text-2xl font-bold text-amber-500 mt-1">{pairedOrdersCount}</div>
        </div>
      </div>

      {/* Create Platform Modal / Inline Form */}
      {showCreateModal && (
        <form
          onSubmit={handleCreatePlatform}
          className="rounded-xl border border-border bg-card p-5 space-y-4"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-foreground">Create New Game Platform</h2>
            <button
              type="button"
              onClick={() => setShowCreateModal(false)}
              className="text-xs text-muted-foreground hover:text-foreground cursor-pointer"
            >
              ✕ Close
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">
                Platform Name
              </label>
              <input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Nintendo Switch Co-Op Pod"
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground"
              >
                <option value="CONSOLE">CONSOLE</option>
                <option value="PC">PC</option>
                <option value="VR">VR</option>
                <option value="SNOOKER">SNOOKER</option>
                <option value="BOWLING">BOWLING</option>
                <option value="TABLE">TABLE</option>
                <option value="ARCADE">ARCADE</option>
                <option value="THEATER">THEATER</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">
                Location
              </label>
              <input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">
                Hourly Rate (₹/hr)
              </label>
              <input
                type="number"
                min="0"
                value={hourlyRate}
                onChange={(e) => setHourlyRate(e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">
                Total Stations / Units
              </label>
              <input
                type="number"
                min="1"
                value={totalUnits}
                onChange={(e) => setTotalUnits(e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">
                Features (comma-separated)
              </label>
              <input
                value={featuresText}
                onChange={(e) => setFeaturesText(e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1">
              Description
            </label>
            <input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe hardware specs, games available, and seating…"
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground"
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowCreateModal(false)}
              className="px-4 py-2 rounded-lg text-xs border border-border text-muted-foreground cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={creating}
              className="px-4 py-2 rounded-lg text-xs font-bold text-white bg-orange-500 hover:bg-orange-600 cursor-pointer"
            >
              {creating ? "Creating…" : "Create Platform"}
            </button>
          </div>
        </form>
      )}

      {/* Sub-navigation Tabs */}
      <div className="flex gap-2 border-b border-border pb-2">
        <button
          onClick={() => setSubTab("platforms")}
          className={`px-4 py-2 rounded-lg text-xs font-semibold cursor-pointer ${
            subTab === "platforms"
              ? "bg-orange-500/15 text-orange-500 border border-orange-500/30"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          🕹️ Game Platforms ({platforms.length})
        </button>
        <button
          onClick={() => setSubTab("tickets")}
          className={`px-4 py-2 rounded-lg text-xs font-semibold cursor-pointer ${
            subTab === "tickets"
              ? "bg-orange-500/15 text-orange-500 border border-orange-500/30"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          🎟️ Booked Tickets &amp; Auto-Push Orders ({tickets.length})
        </button>
      </div>

      {loading ? (
        <div className="p-12 text-center text-xs text-muted-foreground">
          Loading Game Arena data…
        </div>
      ) : subTab === "platforms" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {platforms.map((p) => (
            <div
              key={p.id}
              className="rounded-xl border border-border bg-card p-4 flex flex-col justify-between gap-4"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-orange-500/15 text-orange-400 mb-1">
                      {p.category}
                    </span>
                    <h3 className="text-base font-bold text-foreground">{p.name}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">{p.location}</p>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      p.is_active
                        ? "bg-emerald-500/15 text-emerald-400"
                        : "bg-rose-500/15 text-rose-400"
                    }`}
                  >
                    {p.is_active ? "ACTIVE" : "INACTIVE"}
                  </span>
                </div>

                <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
                  {p.description}
                </p>

                <div className="mt-3 flex items-center justify-between text-xs border-t border-border pt-2">
                  <span className="font-semibold text-foreground">
                    Rate: {formatCurrency(p.hourly_rate)}/hr
                  </span>
                  <span className="text-muted-foreground">
                    Stations: <strong className="text-foreground">{p.available_units}</strong> /{" "}
                    {p.total_units} free
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-border">
                <button
                  disabled={busyId === p.id}
                  onClick={() => void handleToggleActive(p)}
                  className="flex-1 px-3 py-1.5 rounded-lg text-xs font-semibold border border-border hover:bg-muted cursor-pointer"
                >
                  {p.is_active ? "Pause" : "Activate"}
                </button>
                <button
                  disabled={busyId === p.id}
                  onClick={() => void handleResetUnits(p)}
                  className="flex-1 px-3 py-1.5 rounded-lg text-xs font-semibold border border-border hover:bg-muted cursor-pointer"
                >
                  Reset Stations
                </button>
                {p.is_active && (
                  <button
                    disabled={busyId === p.id}
                    onClick={() => void handleDeactivate(p)}
                    className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-rose-400 hover:bg-rose-500/10 cursor-pointer"
                  >
                    Disable
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          {tickets.length === 0 ? (
            <div className="p-12 text-center text-xs text-muted-foreground">
              No game tickets have been booked yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-muted/40 text-muted-foreground uppercase text-[10px]">
                  <tr>
                    <th className="px-4 py-3">Ticket</th>
                    <th className="px-4 py-3">Platform &amp; Station</th>
                    <th className="px-4 py-3">Duration &amp; Window</th>
                    <th className="px-4 py-3">Paired Food Order</th>
                    <th className="px-4 py-3">Auto-Push Status</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {tickets.map((t) => (
                    <tr key={t.id} className="hover:bg-muted/20">
                      <td className="px-4 py-3 font-mono font-bold text-foreground">
                        {t.ticket_code}
                        <div className="text-[10px] font-sans text-muted-foreground">
                          {formatCurrency(t.ticket_amount)} · {t.status}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-semibold text-foreground">
                          {t.platform?.name || "Game Platform"}
                        </div>
                        <div className="text-[11px] text-muted-foreground">
                          Station {t.station_label} · {t.players_count}p
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-semibold text-foreground">{t.duration_hours} hrs</div>
                        <div className="text-[10px] text-muted-foreground">
                          Ends{" "}
                          {new Date(t.end_time).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        {t.linked_order ? (
                          <div>
                            <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/15 text-amber-400 mr-1.5">
                              {t.fulfillment_mode === "TAKEAWAY" ? "🥡 TAKEAWAY" : "🍽️ DINE-IN"}
                            </span>
                            <span className="font-semibold text-foreground">
                              {formatCurrency(t.linked_order.total_amount)}
                            </span>
                            <div className="text-[10px] text-muted-foreground mt-0.5">
                              Order Status: <strong>{t.linked_order.status}</strong>
                            </div>
                          </div>
                        ) : (
                          <span className="text-muted-foreground">Ticket Only</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {t.linked_order_id ? (
                          t.order_pushed ? (
                            <span className="px-2 py-1 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-400">
                              ✓ Pushed to Kitchen
                            </span>
                          ) : (
                            <span className="px-2 py-1 rounded-full text-[10px] font-bold bg-indigo-500/15 text-indigo-400">
                              ⏳ Waiting for {t.duration_hours}h End
                            </span>
                          )
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right space-x-2">
                        {t.status === "ACTIVE" && (
                          <>
                            <button
                              disabled={busyId === t.id}
                              onClick={() => void handlePushTicketOrder(t)}
                              className="px-2.5 py-1 rounded bg-orange-500 hover:bg-orange-600 text-white text-[11px] font-semibold cursor-pointer"
                            >
                              ⚡ End &amp; Push Now
                            </button>
                            <button
                              disabled={busyId === t.id}
                              onClick={() => void handleCancelTicket(t)}
                              className="px-2.5 py-1 rounded border border-border text-rose-400 hover:bg-rose-500/10 text-[11px] cursor-pointer"
                            >
                              Cancel
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

