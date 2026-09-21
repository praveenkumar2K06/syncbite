import type { ApiClientInstance } from "../client";

export interface NotificationLog {
  id: string;
  user_id: string;
  channel: string;
  recipient: string;
  subject: string | null;
  body: string;
  status: string;
  vendor_message_id: string | null;
  created_at: string;
}

export async function getMyNotificationsApi(client: ApiClientInstance): Promise<NotificationLog[]> {
  return client<NotificationLog[]>("/notifications/me");
}

export interface NotificationSendRequest {
  recipient: string;
  subject: string;
  body: string;
  channel?: "EMAIL" | "SMS" | "PUSH";
}

export async function sendNotificationApi(
  client: ApiClientInstance,
  payload: NotificationSendRequest,
): Promise<void> {
  return client<void>("/notifications/send", {
    method: "POST",
    body: JSON.stringify({
      recipient: payload.recipient.trim(),
      subject: payload.subject.trim(),
      body: payload.body.trim(),
      channel: payload.channel || "EMAIL",
    }),
  });
}
