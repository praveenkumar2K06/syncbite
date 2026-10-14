import { apiClient } from "../client";
import {
  getFeatureFlagsApi as sharedGetFeatureFlags,
  toggleFeatureFlagApi as sharedToggleFeatureFlag,
} from "@syncbite/shared";
import type { FeatureFlag } from "@syncbite/shared";

export async function getFeatureFlagsApi(): Promise<FeatureFlag[]> {
  return sharedGetFeatureFlags(apiClient);
}

export async function toggleFeatureFlagApi(
  key: string,
  enabled: boolean,
  value?: string | null,
): Promise<FeatureFlag> {
  return sharedToggleFeatureFlag(apiClient, key, enabled, value);
}

export const updateFeatureFlagApi = toggleFeatureFlagApi;
