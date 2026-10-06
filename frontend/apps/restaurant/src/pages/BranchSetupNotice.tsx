import { useState, useEffect } from "react";
import { listBranchesApi, type Branch } from "@/api";
import { C } from "@/constants";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface BranchSetupNoticeProps {
  error: string;
  /** Outlets this account owns. Non-empty means the picker is required. */
  owned: Branch[];
  onSave: (id: string) => void;
  onSignOut: () => void;
}

export default function BranchSetupNotice({
  error,
  owned,
  onSave,
  onSignOut,
}: BranchSetupNoticeProps) {
  const [branches, setBranches] = useState<Branch[] | null>(null);
  const [selected, setSelected] = useState("");
  const [manual, setManual] = useState("");
  const [showManual, setShowManual] = useState(false);

  // Single-outlet accounts never reach this screen — the shell resolves their
  // branch automatically. This handles two cases: an account owning several
  // outlets, and one the automatic lookup could not resolve at all.
  useEffect(() => {
    if (owned.length) {
      setBranches(owned);
      setSelected((prev) => prev || owned[0].id);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const list = await listBranchesApi();
        if (cancelled) return;
        setBranches(list);
        if (list.length === 1) setSelected(list[0].id);
      } catch {
        if (!cancelled) {
          setBranches([]);
          setShowManual(true);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [owned]);

  const isAmbiguous = owned.length > 1;
  const value = showManual ? manual.trim() : selected;
  const canContinue = value.length > 0;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 300,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(15,23,42,.92)",
        padding: "24px 16px",
      }}
    >
      <Card className="w-full max-w-[420px] bg-card border-border shadow-2xl">
        <CardHeader className="p-6 pb-2">
          <CardTitle className="text-lg font-bold text-foreground">
            {isAmbiguous ? "Choose your outlet" : "Set your outlet"}
          </CardTitle>
          <CardDescription className="text-sm leading-relaxed mt-1 text-muted-foreground">
            {isAmbiguous
              ? "Your account manages more than one outlet. Pick the one you want to work in — we’ll remember it on this device."
              : "We couldn’t match your account to an outlet automatically. Pick it once and we’ll remember it on this device."}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 pt-3 flex flex-col gap-3">
          {error && (
            <div
              style={{
                padding: "9px 12px",
                borderRadius: 4,
                background: C.redBg,
                border: `1px solid #fca5a5`,
              }}
            >
              <p style={{ fontSize: 12, color: C.red, margin: 0 }}>{error}</p>
            </div>
          )}

          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (canContinue) onSave(value);
            }}
            style={{ display: "flex", flexDirection: "column", gap: 12 }}
          >
            {branches === null ? (
              <p className="text-sm text-muted-foreground py-2 text-center">Loading outlets…</p>
            ) : showManual || branches.length === 0 ? (
              <Input
                value={manual}
                onChange={(e) => setManual(e.target.value)}
                placeholder="Outlet ID (a UUID)"
                required
                autoComplete="off"
                spellCheck={false}
              />
            ) : (
              <Select value={selected} onValueChange={(val) => setSelected(val ?? "")}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select your outlet…">
                    {(selectedId: string | null) => {
                      const branch = branches.find((b) => b.id === selectedId);
                      return branch
                        ? branch.address_text
                          ? `${branch.name} — ${branch.address_text}`
                          : branch.name
                        : selectedId;
                    }}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {branches.map((b) => (
                    <SelectItem key={b.id} value={b.id}>
                      {b.name}
                      {b.address_text ? ` — ${b.address_text}` : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            <Button
              type="submit"
              disabled={!canContinue}
              className="w-full h-10 text-sm font-semibold"
            >
              Continue
            </Button>

            {branches !== null && branches.length > 0 && (
              <Button
                type="button"
                variant="link"
                size="sm"
                onClick={() => setShowManual((m) => !m)}
                className="text-muted-foreground hover:text-foreground text-xs"
              >
                {showManual ? "Choose from list instead" : "Enter outlet ID manually"}
              </Button>
            )}
          </form>

          <Button
            type="button"
            variant="outline"
            onClick={onSignOut}
            className="w-full text-muted-foreground mt-1"
          >
            Sign out
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
