export interface BranchPerformanceItem {
  id: string;
  name: string;
  orderCount: number;
  volume: number;
}

export interface CustomerStats {
  newStudents: number;
  activeCustomers: number;
  repeatCustomers: number;
  repeatRate: number;
  retentionRate: number;
}

export interface DishVelocityItem {
  name: string;
  orders: number;
  volume: number;
  outlet: string;
}

export interface CategoryVelocityItem {
  name: string;
  count: number;
  sharePct: number;
}
