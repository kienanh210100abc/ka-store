import { useEffect, useState } from "react";
import { API } from "../tables/tableConfig";
import type { DashboardStats, RecentOrder, DayRevenue } from "./types";

export const useDashboardData = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalRevenue: 0,
    todayRevenue: 0,
    totalOrders: 0,
    paidOrders: 0,
    pendingOrders: 0,
    activeTables: 0,
  });
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [weeklyRevenue, setWeeklyRevenue] = useState<DayRevenue[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch(API);
      const data = await response.json();

      // Calculate total revenue from paid orders
      const totalRevenue = data.orders.reduce((sum: number, order: any) => {
        if (order.status === "PAID") {
          return sum + (order.total || 0);
        }
        return sum;
      }, 0);

      // Calculate today's revenue
      const today = new Date().toDateString();
      const todayRevenue = data.orders.reduce((sum: number, order: any) => {
        const orderDate = new Date(order.createdAt).toDateString();
        if (order.status === "PAID" && orderDate === today) {
          return sum + (order.total || 0);
        }
        return sum;
      }, 0);

      // Count orders by status
      const paidOrders = data.orders.filter(
        (order: any) => order.status === "PAID",
      ).length;
      const pendingOrders = data.orders.filter(
        (order: any) =>
          order.status === "PENDING" || order.status === "CHECKED_IN",
      ).length;

      // Count active tables (tables with pending orders)
      const activeTables = new Set(
        data.orders
          .filter(
            (order: any) =>
              order.status === "PENDING" || order.status === "CHECKED_IN",
          )
          .map((order: any) => order.tableId),
      ).size;

      setStats({
        totalRevenue,
        todayRevenue,
        totalOrders: data.orders.length,
        paidOrders,
        pendingOrders,
        activeTables,
      });

      // Get recent orders (last 5)
      const recent = data.orders
        .sort(
          (a: any, b: any) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        )
        .slice(0, 5)
        .map((order: any) => ({
          id: order.id,
          tableId: order.tableId,
          total: order.total || 0,
          status: order.status,
          createdAt: order.createdAt,
        }));

      setRecentOrders(recent);

      // Calculate weekly revenue (last 7 days)
      const getDayName = (date: Date, locale: string = "vi-VN") => {
        const days = {
          "vi-VN": ["CN", "T2", "T3", "T4", "T5", "T6", "T7"],
          "en-US": ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
        };
        const dayIndex = date.getDay();
        return (
          days[locale as keyof typeof days]?.[dayIndex] ||
          days["vi-VN"][dayIndex]
        );
      };

      const last7Days: DayRevenue[] = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dayString = date.toLocaleDateString("en-CA"); // YYYY-MM-DD format

        const dayRevenue = data.orders.reduce((sum: number, order: any) => {
          const orderDate = new Date(order.createdAt).toLocaleDateString(
            "en-CA",
          );
          if (order.status === "PAID" && orderDate === dayString) {
            return sum + (order.total || 0);
          }
          return sum;
        }, 0);

        last7Days.push({
          day: dayString,
          dayName: getDayName(date),
          revenue: dayRevenue,
        });
      }

      setWeeklyRevenue(last7Days);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  return { stats, recentOrders, weeklyRevenue, loading, refetch: fetchData };
};
