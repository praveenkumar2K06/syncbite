import type { MerchantRecord } from "../../api/admin";
import { AdminDialog } from "../ui/admin-dialog";
import ManagerCredentialPanel from "./branch-login/ManagerCredentialPanel";

interface MerchantCredentialsModalProps {
  isOpen: boolean;
  onClose: () => void;
  merchant: MerchantRecord | null;
  onCopy: (text: string, successMsg?: string, fieldId?: string) => void;
}

export default function MerchantCredentialsModal({
  isOpen,
  onClose,
  merchant,
  onCopy,
}: MerchantCredentialsModalProps) {
  if (!isOpen || !merchant) return null;

  return (
    <AdminDialog
      open={isOpen}
      onClose={onClose}
      title="Merchant Owner Credentials"
      description={`Reset password or copy credentials for ${merchant.business_name}. Existing passwords cannot be retrieved.`}
      className="!max-w-lg"
    >
      <ManagerCredentialPanel
        ownerUserId={merchant.owner_user_id}
        ownerEmail={merchant.owner_email ?? undefined}
        accountLabel="Merchant Owner"
        merchantName={merchant.business_name}
        onCopy={onCopy}
      />
    </AdminDialog>
  );
}
