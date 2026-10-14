import { useCallback, useState } from "react";
import type { ToastState } from "../types/dashboard";
import { formatCredentialPacket } from "../utils/credentials";

export function useDashboardFeedback() {
  const [toast, setToast] = useState<ToastState | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const showToast = useCallback((msg: string, type: "success" | "error") => {
    setToast({ msg, type });
  }, []);

  const copyToClipboard = useCallback(
    async (text: string, successMsg = "Copied to clipboard! ✓", fieldId?: string) => {
      try {
        await navigator.clipboard.writeText(text);
        if (fieldId) {
          setCopiedField(fieldId);
          setTimeout(() => setCopiedField(null), 1800);
        }
        showToast(successMsg, "success");
      } catch {
        showToast("Could not copy automatically. Please select and copy.", "error");
      }
    },
    [showToast],
  );

  const downloadCredentialsTxt = useCallback(
    (
      name: string,
      email: string,
      pass: string,
      branchId?: string,
      role = "MerchantOwner",
      branchManagerEmail?: string,
      branchManagerPass?: string,
    ) => {
      const content = formatCredentialPacket({
        name,
        email,
        password: pass,
        branchId,
        role,
        branchManagerEmail,
        branchManagerPassword: branchManagerPass,
      });
      const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `syncbite_${name.toLowerCase().replace(/[^a-z0-9]/g, "_")}_credentials.txt`;
      anchor.click();
      URL.revokeObjectURL(url);
      showToast("Credentials downloaded (.txt)! ✓", "success");
    },
    [showToast],
  );

  return { toast, setToast, copiedField, showToast, copyToClipboard, downloadCredentialsTxt };
}
