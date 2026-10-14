import type {
  OrderMode,
  StudentOrderStatus,
  StudentItemCategory,
  StudentMenuItem,
  RestaurantViewModel,
  CartItem,
  StudentOrder,
} from "@syncbite/shared";

export type MenuItem = StudentMenuItem;
export type Restaurant = RestaurantViewModel;
export type Order = StudentOrder;

export type {
  OrderMode,
  StudentOrderStatus,
  StudentItemCategory,
  StudentMenuItem,
  RestaurantViewModel,
  CartItem,
  StudentOrder,
};

export type Page =
  | "home"
  | "browse"
  | "games"
  | "restaurant"
  | "checkout"
  | "confirmation"
  | "orders"
  | "profile";
