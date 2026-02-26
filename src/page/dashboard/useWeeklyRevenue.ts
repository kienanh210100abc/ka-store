import { useState, useEffect } from "react";
import { API } from "../tables/tableConfig";
import type { DayRevenue } from "./types";

// Helper function to get Monday of a week
const getMonday = (date: Date) => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
  return new Date(d.setDate(diff));
};

// Helper function to get day name
const getDayName = (date: Date, locale: string = "vi-VN") => {
  const days = {
    "vi-VN": ["CN", "T2", "T3", "T4", "T5", "T6", "T7"],
    "en-US": ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  };
  const dayIndex = date.getDay();
  return (
    days[locale as keyof typeof days]?.[dayIndex] || days["vi-VN"][dayIndex]
  );
};

export const useWeeklyRevenue = () => {
  const [weeklyRevenue, setWeeklyRevenue] = useState<DayRevenue[]>([]);
  const [weekOffset, setWeekOffset] = useState(0); // 0 = current week, -1 = previous week, etc.
  const [loading, setLoading] = useState(true);

  const fetchWeeklyData = async (offset: number) => {
    try {
      setLoading(true);
      const response = await fetch(API);
      const data = await response.json();

      // Calculate the Monday of the target week
      const today = new Date();
      const targetMonday = getMonday(today);
      targetMonday.setDate(targetMonday.getDate() + offset * 7);

      // Generate 7 days from Monday to Sunday
      const weekData: DayRevenue[] = [];
      for (let i = 0; i < 7; i++) {
        const date = new Date(targetMonday);
        date.setDate(targetMonday.getDate() + i);
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

        weekData.push({
          day: dayString,
          dayName: getDayName(date),
          revenue: dayRevenue,
        });
      }

      setWeeklyRevenue(weekData);
    } catch (error) {
      console.error("Error fetching weekly data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeeklyData(weekOffset);
  }, [weekOffset]);

  const goToPreviousWeek = () => {
    setWeekOffset((prev) => prev - 1);
  };

  const goToNextWeek = () => {
    setWeekOffset((prev) => prev + 1);
  };

  const goToCurrentWeek = () => {
    setWeekOffset(0);
  };

  // Get week range for display
  const getWeekRange = () => {
    if (weeklyRevenue.length === 0)
      return { start: "", end: "", isCurrentWeek: false };

    const firstDay = new Date(weeklyRevenue[0].day);
    const lastDay = new Date(weeklyRevenue[6].day);

    const formatDate = (date: Date) => {
      return `${date.getDate()}/${date.getMonth() + 1}`;
    };

    return {
      start: formatDate(firstDay),
      end: formatDate(lastDay),
      isCurrentWeek: weekOffset === 0,
    };
  };

  return {
    weeklyRevenue,
    loading,
    weekOffset,
    goToPreviousWeek,
    goToNextWeek,
    goToCurrentWeek,
    getWeekRange,
    refetch: () => fetchWeeklyData(weekOffset),
  };
};
