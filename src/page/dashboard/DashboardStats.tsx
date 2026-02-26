import { Grid } from "@mui/material";
import { useTranslation } from "react-i18next";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TableRestaurantIcon from "@mui/icons-material/TableRestaurant";
import StatCard from "./StatCard";
import type { DashboardStats as StatsType } from "./types";
import { formatCurrency } from "./utils";

interface DashboardStatsProps {
  stats: StatsType;
}

const DashboardStats = ({ stats }: DashboardStatsProps) => {
  const { t } = useTranslation();

  return (
    <Grid container spacing={3} sx={{ mb: 4 }}>
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <StatCard
          title={t("dashboard.totalRevenue") || "Total Revenue"}
          value={formatCurrency(stats.totalRevenue)}
          icon={<AttachMoneyIcon sx={{ color: "white", fontSize: 28 }} />}
          color="#10b981"
          subtitle={`${stats.paidOrders} ${t("dashboard.paidOrders") || "paid orders"}`}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <StatCard
          title={t("dashboard.todayRevenue") || "Today's Revenue"}
          value={formatCurrency(stats.todayRevenue)}
          icon={<TrendingUpIcon sx={{ color: "white", fontSize: 28 }} />}
          color="#3b82f6"
          subtitle={t("dashboard.today") || "Today"}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <StatCard
          title={t("dashboard.totalOrders") || "Total Orders"}
          value={stats.totalOrders}
          icon={<ShoppingCartIcon sx={{ color: "white", fontSize: 28 }} />}
          color="#f59e0b"
          subtitle={`${stats.pendingOrders} ${t("dashboard.pending") || "pending"}`}
        />
      </Grid>
    </Grid>
  );
};

export default DashboardStats;
