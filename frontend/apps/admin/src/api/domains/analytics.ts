import { apiClient } from "../client";
import { getAnalyticsApi as sharedGetAnalytics } from "@syncbite/shared";
import type { PlatformAnalytics } from "@syncbite/shared";

export async function getAnalyticsApi(): Promise<PlatformAnalytics> {
  return sharedGetAnalytics(apiClient);
}
