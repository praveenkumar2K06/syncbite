import { RESTAURANT_PORTAL_URL } from "../config";
import { formatDateTime } from "./format";

export interface CredentialPacket {
  name: string;
  email: string;
  password: string;
  branchId?: string;
  role?: string;
  branchManagerEmail?: string;
  branchManagerPassword?: string;
  branchManagerRole?: string;
}

export function formatCredentialPacket(packet: CredentialPacket): string {
  return `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🍔 SYNCBITE CAMPUS - RESTAURANT CREDENTIALS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Restaurant Name : ${packet.name}
${packet.branchId ? `Branch ID       : ${packet.branchId}\n` : ""}Login Portal    : ${RESTAURANT_PORTAL_URL}

🏢 MERCHANT OWNER (Legal & Settlements):
Login Email     : ${packet.email}
Password        : ${packet.password}
Role            : ${packet.role || "MerchantOwner"}
${
  packet.branchManagerEmail
    ? `
🍽️ BRANCH MANAGER (Store Operations & Kitchen):
Login Email     : ${packet.branchManagerEmail}
Password        : ${packet.branchManagerPassword || packet.password}
Role            : ${packet.branchManagerRole || "BranchManager"}
`
    : ""
}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Issued on: ${formatDateTime(new Date())}
Confidential. Share only with authorized store stakeholders.
`;
}
