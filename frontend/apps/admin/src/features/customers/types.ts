import type { AdminCustomerAddressResponse } from "@syncbite/shared";

export interface CustomerData {
  id: string;
  user_id?: string;
  name: string;
  email: string;
  phone: string;
  campus_hostel: string;
  status: "ACTIVE" | "SUSPENDED" | "FLAGGED";
  is_active?: boolean;
  is_verified?: boolean;
  created_at: string;
  updated_at?: string;
  total_orders: number;
  total_spent: number;
  addresses?: AdminCustomerAddressResponse[];
  orders: Array<{
    id: string;
    restaurant_name: string;
    total_amount: number;
    status: string;
    date: string;
  }>;
  payments: Array<{
    id: string;
    amount: number;
    method: string;
    status: string;
    date: string;
  }>;
  reviews: Array<{
    id: string;
    restaurant_name: string;
    rating: number;
    comment: string;
    date: string;
  }>;
}
