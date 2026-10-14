import { useEffect, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Copy01Icon,
  EyeIcon,
  EyeOffIcon,
  Key01Icon,
  Refresh01Icon,
} from "@hugeicons/core-free-icons";
import type { BranchManagerResponse } from "../../../api/admin";
import { adminSetPasswordApi } from "../../../api/domains/auth";
import { generateSecurePassword } from "../../../utils/formatters";
import { Button } from "../../ui/button";
import { InputGroup, InputGroupButton, InputGroupInput } from "../../ui/input-group";

interface ManagerCredentialPanelProps {
  manager?: BranchManagerResponse;
  ownerUserId?: string;
  ownerEmail?: string;
  accountLabel?: string;
  branchName?: string;
  merchantName?: string;
  onCopy: (text: string, successMsg?: string, fieldId?: string) => void;
}

export default function ManagerCredentialPanel({
  manager,
  ownerUserId,
  ownerEmail,
  accountLabel = "Branch Manager",
  branchName,
  merchantName,
  onCopy,
}: ManagerCredentialPanelProps) {
  const userId = manager?.user_id || ownerUserId;
  const displayName = merchantName || branchName || manager?.branch_name || "Account";
  const [resolvedEmail, setResolvedEmail] = useState(manager?.email || ownerEmail || "");
  const [password, setPassword] = useState(() => generateSecurePassword(displayName));
  const [showPassword, setShowPassword] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const nextEmail = manager?.email || ownerEmail || "";
    setResolvedEmail(nextEmail);
    setPassword(generateSecurePassword(displayName));
    setMessage(null);
    setError(null);
  }, [userId, ownerEmail, manager?.email, displayName]);

  if (!userId && !resolvedEmail) {
    return (
      <div className="rounded-lg border border-border p-4 text-xs text-muted-foreground text-center">
        No account user ID or email associated with this merchant account.
      </div>
    );
  }

  const regenerate = () => {
    setPassword(generateSecurePassword(displayName));
    setMessage(null);
    setError(null);
  };

  const save = async () => {
    if (password.trim().length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setSaving(true);
    setError(null);
    setMessage(null);
    try {
      const res = await adminSetPasswordApi({
        user_id: userId || undefined,
        email: !userId ? resolvedEmail || undefined : undefined,
        password: password.trim(),
      });
      if (res.email && !resolvedEmail) {
        setResolvedEmail(res.email);
      }
      setMessage("Password updated successfully.");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Unable to update password.");
    } finally {
      setSaving(false);
    }
  };

  const copyPacket = () => {
    onCopy(
      `${accountLabel} (${displayName})\nEmail: ${resolvedEmail || "Email unavailable"}\nPassword: ${password}${userId ? `\nUser ID: ${userId}` : ""}`,
      "Credentials packet copied.",
      `credentials-${userId || resolvedEmail}`,
    );
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between rounded-lg border border-border bg-muted/30 px-3 py-2.5">
        <div className="flex items-center gap-2">
          <HugeiconsIcon icon={Key01Icon} size={15} className="text-primary" />
          <span className="text-xs font-medium text-foreground">{accountLabel}</span>
        </div>
        <span className="rounded-md border border-border bg-background px-2 py-1 font-mono text-[10px] text-muted-foreground">
          {manager?.role || (ownerUserId ? "MerchantOwner" : "BranchManager")}
        </span>
      </div>

      <div className="grid gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-muted-foreground">Login email</label>
          <InputGroup>
            <InputGroupInput
              value={resolvedEmail || "Email unavailable"}
              readOnly
              className="font-mono text-xs"
            />
            {resolvedEmail && (
              <InputGroupButton
                type="button"
                aria-label="Copy login email"
                onClick={() => onCopy(resolvedEmail, "Email copied.")}
              >
                <HugeiconsIcon icon={Copy01Icon} size={14} />
                <span>Copy</span>
              </InputGroupButton>
            )}
          </InputGroup>
        </div>

        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-medium text-muted-foreground">New password</label>
            <button
              type="button"
              onClick={regenerate}
              className="inline-flex cursor-pointer items-center gap-1 text-[11px] font-medium text-primary hover:text-primary/80"
            >
              <HugeiconsIcon icon={Refresh01Icon} size={13} />
              Regenerate
            </button>
          </div>
          <InputGroup>
            <InputGroupInput
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="font-mono text-xs"
            />
            <InputGroupButton
              type="button"
              aria-label={showPassword ? "Hide password" : "Show password"}
              onClick={() => setShowPassword((visible) => !visible)}
            >
              <HugeiconsIcon icon={showPassword ? EyeOffIcon : EyeIcon} size={15} />
            </InputGroupButton>
            <InputGroupButton type="button" onClick={copyPacket} aria-label="Copy credentials">
              <HugeiconsIcon icon={Copy01Icon} size={15} />
              <span>Copy</span>
            </InputGroupButton>
          </InputGroup>
        </div>
      </div>

      {(message || error) && (
        <p
          role={error ? "alert" : "status"}
          className={`rounded-lg border px-3 py-2 text-xs ${
            error
              ? "border-destructive/30 bg-destructive/10 text-destructive"
              : "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
          }`}
        >
          {error || message}
        </p>
      )}

      <div className="flex items-center justify-between gap-3 border-t border-border pt-4">
        <p className="text-[11px] text-muted-foreground">Use at least 8 characters.</p>
        <Button
          type="button"
          variant="primary"
          onClick={save}
          disabled={saving || !password.trim()}
        >
          {saving ? "Updating..." : "Update Password"}
        </Button>
      </div>
    </div>
  );
}
