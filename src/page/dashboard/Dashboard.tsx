import { Box, Typography, Grid } from "@mui/material";
import { useTranslation } from "react-i18next";
import DashboardStats from "./DashboardStats";
import DashboardChart from "./DashboardChart";
import { useDashboardData } from "./useDashboardData";

const Dashboard = () => {
  const { t } = useTranslation();
  const { stats } = useDashboardData();

  return (
    <Box sx={{ p: 3 }}>
      <Typography
        variant="h4"
        fontWeight="bold"
        sx={{ mb: 4, color: "#1a1a1a" }}
      >
        {t("dashboard.title") || "Dashboard"}
      </Typography>

      <DashboardStats stats={stats} />

      {/* Charts Section */}
      <Grid container spacing={3} sx={{ mt: 1 }}>
        <Grid size={{ xs: 12, lg: 12 }}>
          <DashboardChart />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
