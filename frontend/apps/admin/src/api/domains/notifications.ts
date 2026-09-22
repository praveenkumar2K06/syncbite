import { apiClient } from "../client";
import {
  getMyNotificationsApi as sharedGetMyNotificationsApi,
  sendNotificationApi as sharedSendNotificationApi,
  type NotificationLog,
  type NotificationSendRequest,
} from "@syncbite/shared";

export type { NotificationSendRequest };
export type NotificationResponse = NotificationLog;

export async function sendNotificationApi(payload: NotificationSendRequest): Promise<void> {
  return sharedSendNotificationApi(apiClient, payload);
}

export async function getMyNotificationsApi(): Promise<NotificationResponse[]> {
  return sharedGetMyNotificationsApi(apiClient);
}
