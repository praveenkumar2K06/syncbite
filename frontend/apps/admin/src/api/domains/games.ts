import { apiClient } from "../client";
import {
  getGamePlatformsApi as sharedGetPlatforms,
  createGamePlatformApi as sharedCreatePlatform,
  updateGamePlatformApi as sharedUpdatePlatform,
  deleteGamePlatformApi as sharedDeletePlatform,
  getGameTicketsApi as sharedGetTickets,
  pushGameTicketOrderApi as sharedPushOrder,
  cancelGameTicketApi as sharedCancelTicket,
  type GamePlatform,
  type GameTicket,
  type CreateGamePlatformPayload,
  type UpdateGamePlatformPayload,
} from "@syncbite/shared";

export type {
  GamePlatform,
  GameTicket,
  CreateGamePlatformPayload,
  UpdateGamePlatformPayload,
};

export async function getAdminGamePlatformsApi(): Promise<GamePlatform[]> {
  return sharedGetPlatforms(apiClient, true);
}

export async function createAdminGamePlatformApi(
  payload: CreateGamePlatformPayload,
): Promise<GamePlatform> {
  return sharedCreatePlatform(apiClient, payload);
}

export async function updateAdminGamePlatformApi(
  platformId: string,
  payload: UpdateGamePlatformPayload,
): Promise<GamePlatform> {
  return sharedUpdatePlatform(apiClient, platformId, payload);
}

export async function deleteAdminGamePlatformApi(platformId: string): Promise<void> {
  return sharedDeletePlatform(apiClient, platformId);
}

export async function getAdminGameTicketsApi(status?: string): Promise<GameTicket[]> {
  return sharedGetTickets(apiClient, status);
}

export async function pushAdminGameTicketOrderApi(
  ticketId: string,
): Promise<GameTicket> {
  return sharedPushOrder(apiClient, ticketId);
}

export async function cancelAdminGameTicketApi(ticketId: string): Promise<GameTicket> {
  return sharedCancelTicket(apiClient, ticketId);
}

