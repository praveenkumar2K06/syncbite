import { apiClient } from "../client";
import {
  getBannersApi as sharedGetBannersApi,
  createBannerApi as sharedCreateBannerApi,
  deleteBannerApi as sharedDeleteBannerApi,
  type BannerResponse,
  type BannerCreate,
} from "@syncbite/shared";

export type { BannerResponse, BannerCreate };

export async function getBannersApi(): Promise<BannerResponse[]> {
  return sharedGetBannersApi(apiClient);
}

export async function createBannerApi(payload: BannerCreate): Promise<BannerResponse> {
  return sharedCreateBannerApi(apiClient, payload);
}

export async function deleteBannerApi(bannerId: string): Promise<void> {
  return sharedDeleteBannerApi(apiClient, bannerId);
}
