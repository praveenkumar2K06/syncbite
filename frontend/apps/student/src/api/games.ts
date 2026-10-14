import { apiClient } from "./client";
import {
  getGamePlatformsApi as sharedGetPlatforms,
  bookGameTicketApi as sharedBookTicket,
  getGameTicketsApi as sharedGetTickets,
  pushGameTicketOrderApi as sharedPushOrder,
  cancelGameTicketApi as sharedCancelTicket,
  extendGameTicketApi as sharedExtendTicket,
  type GamePlatform,
  type GameTicket,
  type CreateGameTicketPayload,
  type ExtendGameTicketPayload,
  type GameFulfillmentMode,
} from "@syncbite/shared";

export type { GamePlatform, GameTicket, CreateGameTicketPayload, ExtendGameTicketPayload, GameFulfillmentMode };

const FALLBACK_PLATFORMS: GamePlatform[] = [
  {
    id: "01960000-0000-7000-8000-000000000101",
    name: "PlayStation 5 Pro Arena",
    category: "CONSOLE",
    description:
      "4K 120Hz OLED lounges with DualSense Edge controllers, FIFA 26, Tekken 8, Spider-Man 2 & GTA Online.",
    hourly_rate: 150,
    total_units: 8,
    available_units: 6,
    location: "Level 1 · Neon Console Lounge",
    image_url:
      "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?auto=format&fit=crop&w=800&q=80",
    features: ["4K 120Hz OLED", "DualSense Edge", "Up to 4 Players", "Co-op Library"],
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "01960000-0000-7000-8000-000000000102",
    name: "RTX 4090 Esports PC Rig",
    category: "PC",
    description:
      "360Hz BenQ Zowie monitors, mechanical optical keyboards, and fiber LAN for Valorant, CS2 & Dota 2.",
    hourly_rate: 120,
    total_units: 15,
    available_units: 11,
    location: "Level 1 · Cyber LAN Boot-Camp",
    image_url:
      "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80",
    features: ["RTX 4090 GPU", "360Hz Monitor", "1Gbps Fiber", "HyperX Cloud III"],
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "01960000-0000-7000-8000-000000000103",
    name: "Meta Quest 3 VR Omni-Pod",
    category: "VR",
    description:
      "Full-room wireless VR arena with haptic vests for Beat Saber, Half-Life: Alyx & Superhot VR.",
    hourly_rate: 220,
    total_units: 4,
    available_units: 3,
    location: "Level 2 · Holo-Deck Bay",
    image_url:
      "https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?auto=format&fit=crop&w=800&q=80",
    features: ["Wireless 4K+ VR", "Haptic Suit", "Full Room-Scale", "Mixed Reality"],
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "01960000-0000-7000-8000-000000000104",
    name: "Championship Snooker & Pool",
    category: "TABLE",
    description:
      "Tournament-grade 8-ball pool and English snooker tables with pro Aramith balls and carbon cues.",
    hourly_rate: 180,
    total_units: 6,
    available_units: 5,
    location: "Ground Floor · Cue Club",
    image_url:
      "https://images.unsplash.com/photo-1575361204480-aadea25e6e68?auto=format&fit=crop&w=800&q=80",
    features: ["Pro Felt Table", "Carbon Cues", "2–4 Players", "Table-side Service"],
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "01960000-0000-7000-8000-000000000105",
    name: "Cosmic 10-Pin Bowling Alley",
    category: "ARCADE",
    description:
      "UV glow-in-the-dark bowling lanes with automated scoring, arcade bumpers, and lounge seating.",
    hourly_rate: 300,
    total_units: 4,
    available_units: 4,
    location: "Basement · Strike Zone",
    image_url:
      "https://images.unsplash.com/photo-1545232972-90f3f027e22f?auto=format&fit=crop&w=800&q=80",
    features: ["UV Cosmic Lanes", "Up to 6 Players", "Shoe Rental Included", "Auto Scorer"],
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export async function getGamePlatformsApi(): Promise<GamePlatform[]> {
  try {
    const list = await sharedGetPlatforms(apiClient, false);
    if (Array.isArray(list) && list.length > 0) return list;
    return FALLBACK_PLATFORMS;
  } catch {
    return FALLBACK_PLATFORMS;
  }
}

export async function bookGameTicketApi(
  payload: CreateGameTicketPayload,
): Promise<GameTicket> {
  return sharedBookTicket(apiClient, payload);
}

export async function getGameTicketsApi(status?: string): Promise<GameTicket[]> {
  try {
    return await sharedGetTickets(apiClient, status);
  } catch {
    return [];
  }
}

export async function pushGameTicketOrderApi(ticketId: string): Promise<GameTicket> {
  return sharedPushOrder(apiClient, ticketId);
}

export async function cancelGameTicketApi(ticketId: string): Promise<GameTicket> {
  return sharedCancelTicket(apiClient, ticketId);
}

export async function extendGameTicketApi(ticketId: string, additionalHours: number = 1): Promise<GameTicket> {
  return sharedExtendTicket(apiClient, ticketId, additionalHours);
}

