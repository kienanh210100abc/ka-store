export interface DashboardStats {
  totalRevenue: number;
  todayRevenue: number;
  totalOrders: number;
  paidOrders: number;
  pendingOrders: number;
  activeTables: number;
}

export interface RecentOrder {
  id: number;
  tableId: number;
  total: number;
  status: string;
  createdAt: string;
}

export interface DayRevenue {
  day: string;
  dayName: string;
  revenue: number;
}
