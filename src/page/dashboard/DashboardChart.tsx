import {
  Box,
  Card,
  CardContent,
  Typography,
  IconButton,
  Chip,
  Tooltip as MuiTooltip,
} from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import TodayIcon from "@mui/icons-material/Today";
import { BarChart } from "@mui/x-charts/BarChart";
import { useTranslation } from "react-i18next";
import type { DayRevenue } from "./types";
import { useWeeklyRevenue } from "./useWeeklyRevenue";

export default function DashboardChart() {
  const { t } = useTranslation();
  const {
    weeklyRevenue,
    goToPreviousWeek,
    goToNextWeek,
    goToCurrentWeek,
    getWeekRange,
    loading,
  } = useWeeklyRevenue();

  const weekRange = getWeekRange();

  // Transform data for bar chart
  const chartData = weeklyRevenue.map((item: DayRevenue) => ({
    day: item.dayName,
    revenue: item.revenue,
  }));
  const vndFormatter = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  const valueFormatter = (value: number | null) => {
    if (value === null) return "";
    return vndFormatter.format(value);
  };

  if (loading) {
    return (
      <Card sx={{ boxShadow: "0 4px 12px rgba(0,0,0,0.08)", mt: 3 }}>
        <CardContent>
          <Typography variant="h6" fontWeight="bold">
            {t("dashboard.weeklyRevenue") || "Doanh Thu Tuần"}
          </Typography>
          <Box
            sx={{
              height: 300,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography color="text.secondary">
              {t("dashboard.loading") || "Đang tải..."}
            </Typography>
          </Box>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card sx={{ boxShadow: "0 4px 12px rgba(0,0,0,0.08)", mt: 3 }}>
      <CardContent>
        {/* Header with navigation */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Box>
            <Typography variant="h6" fontWeight="bold">
              {t("dashboard.weeklyRevenueChart") || "Biểu Đồ Doanh Thu Tuần"}
            </Typography>
            {weekRange && (
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.5 }}
              >
                <Typography variant="body2" color="text.secondary">
                  {weekRange.start} - {weekRange.end}
                </Typography>
                {weekRange.isCurrentWeek && (
                  <Chip
                    label={t("dashboard.thisWeek") || "Tuần này"}
                    size="small"
                    color="primary"
                    sx={{ height: 20, fontSize: "0.7rem" }}
                  />
                )}
              </Box>
            )}
          </Box>

          {/* Navigation buttons */}
          <Box sx={{ display: "flex", gap: 0.5 }}>
            <MuiTooltip title={t("dashboard.previousWeek") || "Tuần trước"}>
              <IconButton
                size="small"
                onClick={goToPreviousWeek}
                sx={{
                  border: "1px solid #e5e7eb",
                  "&:hover": { backgroundColor: "#f3f4f6" },
                }}
              >
                <ChevronLeftIcon fontSize="small" />
              </IconButton>
            </MuiTooltip>

            {!weekRange?.isCurrentWeek && (
              <MuiTooltip title={t("dashboard.currentWeek") || "Tuần hiện tại"}>
                <IconButton
                  size="small"
                  onClick={goToCurrentWeek}
                  sx={{
                    border: "1px solid #e5e7eb",
                    "&:hover": { backgroundColor: "#f3f4f6" },
                  }}
                >
                  <TodayIcon fontSize="small" />
                </IconButton>
              </MuiTooltip>
            )}

            <MuiTooltip title={t("dashboard.nextWeek") || "Tuần sau"}>
              <IconButton
                size="small"
                onClick={goToNextWeek}
                sx={{
                  border: "1px solid #e5e7eb",
                  "&:hover": { backgroundColor: "#f3f4f6" },
                }}
              >
                <ChevronRightIcon fontSize="small" />
              </IconButton>
            </MuiTooltip>
          </Box>
        </Box>

        {/* Bar Chart */}
        <Box sx={{ width: "100%", mt: 2 }}>
          <BarChart
            dataset={chartData}
            xAxis={[
              {
                scaleType: "band",
                dataKey: "day",
                tickPlacement: "middle",
                tickLabelPlacement: "middle",
              },
            ]}
            yAxis={[
              {
                label: t("dashboard.revenue") || "Doanh thu ($)",
                valueFormatter,
              },
            ]}
            series={[
              {
                dataKey: "revenue",
                label: t("dashboard.dailyRevenue") || "Doanh thu ngày",
                valueFormatter,
                color: "#3b82f6",
              },
            ]}
            height={350}
            margin={{ left: 80, right: 10, top: 20, bottom: 40 }}
          />
        </Box>

        {/* Summary Statistics */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-around",
            mt: 3,
            pt: 2,
            borderTop: "1px solid #e5e7eb",
          }}
        >
          <Box sx={{ textAlign: "center" }}>
            <Typography variant="caption" color="text.secondary">
              {t("dashboard.totalWeekRevenue") || "Tổng tuần"}
            </Typography>
            <Typography variant="h6" fontWeight="bold" color="primary.main">
              $
              {weeklyRevenue
                .reduce((sum: number, day: DayRevenue) => sum + day.revenue, 0)
                .toLocaleString("en-US", {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                })}
            </Typography>
          </Box>
          <Box sx={{ textAlign: "center" }}>
            <Typography variant="caption" color="text.secondary">
              {t("dashboard.averageDaily") || "Trung bình/ngày"}
            </Typography>
            <Typography variant="h6" fontWeight="bold" color="success.main">
              $
              {weeklyRevenue.length > 0
                ? (
                    weeklyRevenue.reduce(
                      (sum: number, day: DayRevenue) => sum + day.revenue,
                      0,
                    ) / weeklyRevenue.length
                  ).toLocaleString("en-US", {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  })
                : "0"}
            </Typography>
          </Box>
          <Box sx={{ textAlign: "center" }}>
            <Typography variant="caption" color="text.secondary">
              {t("dashboard.highestDay") || "Cao nhất"}
            </Typography>
            <Typography variant="h6" fontWeight="bold" color="warning.main">
              {weeklyRevenue.length > 0 &&
              Math.max(...weeklyRevenue.map((d: DayRevenue) => d.revenue)) > 0
                ? weeklyRevenue.find(
                    (d: DayRevenue) =>
                      d.revenue ===
                      Math.max(
                        ...weeklyRevenue.map((d: DayRevenue) => d.revenue),
                      ),
                  )?.dayName
                : "-"}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
