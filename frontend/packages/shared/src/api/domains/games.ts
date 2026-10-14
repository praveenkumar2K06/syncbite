import type { ApiClientInstance } from "../client";
import type {
  CreateGamePlatformPayload,
  CreateGameTicketPayload,
  GamePlatform,
  GameTicket,
  UpdateGamePlatformPayload,
} from "../../types/game";

export async function getGamePlatformsApi(
  client: ApiClientInstance,
  includeInactive = false,
): Promise<GamePlatform[]> {
  const qs = includeInactive ? "?include_inactive=true" : "";
  return client<GamePlatform[]>(`/games/platforms${qs}`);
}

export async function createGamePlatformApi(
  client: ApiClientInstance,
  payload: CreateGamePlatformPayload,
): Promise<GamePlatform> {
  return client<GamePlatform>("/games/platforms", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateGamePlatformApi(
  client: ApiClientInstance,
  platformId: string,
  payload: UpdateGamePlatformPayload,
): Promise<GamePlatform> {
  return client<GamePlatform>(`/games/platforms/${platformId}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export async function deleteGamePlatformApi(
  client: ApiClientInstance,
  platformId: string,
): Promise<void> {
  await client<void>(`/games/platforms/${platformId}`, {
    method: "DELETE",
  });
}

export async function bookGameTicketApi(
  client: ApiClientInstance,
  payload: CreateGameTicketPayload,
): Promise<GameTicket> {
  return client<GameTicket>("/games/tickets", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function getGameTicketsApi(
  client: ApiClientInstance,
  status?: string,
): Promise<GameTicket[]> {
  const qs = status ? `?status=${encodeURIComponent(status)}` : "";
  return client<GameTicket[]>(`/games/tickets${qs}`);
}

export async function pushGameTicketOrderApi(
  client: ApiClientInstance,
  ticketId: string,
): Promise<GameTicket> {
  return client<GameTicket>(`/games/tickets/${ticketId}/push-order`, {
    method: "POST",
  });
}

export async function cancelGameTicketApi(
  client: ApiClientInstance,
  ticketId: string,
): Promise<GameTicket> {
  return client<GameTicket>(`/games/tickets/${ticketId}/cancel`, {
    method: "POST",
  });
}

export async function extendGameTicketApi(
  client: ApiClientInstance,
  ticketId: string,
  additionalHours: number,
): Promise<GameTicket> {
  return client<GameTicket>(`/games/tickets/${ticketId}/extend`, {
    method: "POST",
    body: JSON.stringify({ additional_hours: additionalHours }),
  });
}

