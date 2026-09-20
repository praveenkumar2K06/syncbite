import type { BackendOrder } from "./order";

export type GameCategory =
  | "CONSOLE"
  | "PC"
  | "VR"
  | "TABLE"
  | "ARCADE"
  | "SNOOKER"
  | "BOWLING"
  | "THEATER"
  | string;
export type GameFulfillmentMode = "DINE_IN" | "TAKEAWAY";
export type GameTicketStatus = "ACTIVE" | "COMPLETED" | "CANCELLED" | string;

export interface GamePlatform {
  id: string;
  name: string;
  category: GameCategory;
  description: string;
  hourly_rate: number;
  total_units: number;
  available_units: number;
  location: string;
  image_url?: string | null;
  features: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateGamePlatformPayload {
  name: string;
  category: GameCategory;
  description?: string;
  hourly_rate: number;
  total_units: number;
  available_units?: number;
  location: string;
  image_url?: string | null;
  features?: string[];
  is_active?: boolean;
}

export type UpdateGamePlatformPayload = Partial<CreateGamePlatformPayload>;

export interface GamePairedFoodOrderPayload {
  branch_id: string;
  branch_name?: string;
  fulfillment_mode: GameFulfillmentMode;
  items: Array<{
    menu_item_id: string;
    quantity: number;
    selected_modifiers_snapshot?: unknown;
  }>;
  instructions?: string;
  use_store_credit?: boolean;
}

export interface CreateGameTicketPayload {
  platform_id: string;
  duration_hours: number;
  players_count?: number;
  start_time?: string;
  station_label?: string;
  food_order?: GamePairedFoodOrderPayload | null;
}

export interface GameTicket {
  id: string;
  ticket_code: string;
  customer_profile_id: string;
  platform_id: string;
  station_label: string;
  duration_hours: number;
  players_count: number;
  ticket_amount: number;
  status: GameTicketStatus;
  start_time: string;
  end_time: string;
  linked_order_id?: string | null;
  fulfillment_mode?: GameFulfillmentMode | null;
  order_pushed: boolean;
  order_pushed_at?: string | null;
  created_at: string;
  updated_at: string;
  platform?: GamePlatform | null;
  linked_order?: BackendOrder | null;
}

export interface ExtendGameTicketPayload {
  additional_hours: number;
}

