import {
  Box,
  Card,
  CardContent,
  Typography,
  IconButton,
  Chip,
  Tooltip as MuiTooltip,
  useMediaQuery,
  useTheme,
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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));

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
      <CardContent sx={{ p: { xs: 2, sm: 2, md: 3 } }}>
        {/* Header with navigation */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: { xs: 2, sm: 2.5, md: 3 },
            flexWrap: isMobile ? "wrap" : "nowrap",
            gap: isMobile ? 1.5 : 0,
          }}
        >
          <Box sx={{ flex: isMobile ? "1 1 100%" : 1 }}>
            <Typography
              variant={isMobile ? "subtitle1" : "h6"}
              fontWeight="bold"
              sx={{ fontSize: { xs: "1rem", sm: "1.1rem", md: "1.25rem" } }}
            >
              {t("dashboard.weeklyRevenueChart") || "Biểu Đồ Doanh Thu Tuần"}
            </Typography>
            {weekRange && (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  mt: 0.5,
                  flexWrap: "wrap",
                }}
              >
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}
                >
                  {weekRange.start} - {weekRange.end}
                </Typography>
                {weekRange.isCurrentWeek && (
                  <Chip
                    label={t("dashboard.thisWeek") || "Tuần này"}
                    size="small"
                    color="primary"
                    sx={{
                      height: { xs: 18, sm: 20 },
                      fontSize: { xs: "0.65rem", sm: "0.7rem" },
                    }}
                  />
                )}
              </Box>
            )}
          </Box>

          {/* Navigation buttons */}
          <Box sx={{ display: "flex", gap: { xs: 0.5, sm: 0.75 } }}>
            <MuiTooltip title={t("dashboard.previousWeek") || "Tuần trước"}>
              <IconButton
                size={isMobile ? "small" : "medium"}
                onClick={goToPreviousWeek}
                sx={{
                  border: "1px solid #e5e7eb",
                  "&:hover": { backgroundColor: "#f3f4f6" },
                  width: { xs: 32, sm: 36 },
                  height: { xs: 32, sm: 36 },
                }}
              >
                <ChevronLeftIcon sx={{ fontSize: { xs: 18, sm: 20 } }} />
              </IconButton>
            </MuiTooltip>

            {!weekRange?.isCurrentWeek && (
              <MuiTooltip title={t("dashboard.currentWeek") || "Tuần hiện tại"}>
                <IconButton
                  size={isMobile ? "small" : "medium"}
                  onClick={goToCurrentWeek}
                  sx={{
                    border: "1px solid #e5e7eb",
                    "&:hover": { backgroundColor: "#f3f4f6" },
                    width: { xs: 32, sm: 36 },
                    height: { xs: 32, sm: 36 },
                  }}
                >
                  <TodayIcon sx={{ fontSize: { xs: 18, sm: 20 } }} />
                </IconButton>
              </MuiTooltip>
            )}

            <MuiTooltip title={t("dashboard.nextWeek") || "Tuần sau"}>
              <IconButton
                size={isMobile ? "small" : "medium"}
                onClick={goToNextWeek}
                sx={{
                  border: "1px solid #e5e7eb",
                  "&:hover": { backgroundColor: "#f3f4f6" },
                  width: { xs: 32, sm: 36 },
                  height: { xs: 32, sm: 36 },
                }}
              >
                <ChevronRightIcon sx={{ fontSize: { xs: 18, sm: 20 } }} />
              </IconButton>
            </MuiTooltip>
          </Box>
        </Box>

        {/* Bar Chart with horizontal scroll on mobile */}
        <Box
          sx={{
            width: "100%",
            mt: { xs: 1, sm: 1.5, md: 2 },
            overflowX: isMobile || isTablet ? "auto" : "visible",
            overflowY: "hidden",
            WebkitOverflowScrolling: "touch",
            "&::-webkit-scrollbar": {
              height: { xs: "6px", sm: "8px" },
            },
            "&::-webkit-scrollbar-track": {
              backgroundColor: "#f1f1f1",
              borderRadius: "4px",
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "#888",
              borderRadius: "4px",
              "&:hover": {
                backgroundColor: "#555",
              },
            },
          }}
        >
          <Box
            sx={{
              minWidth: isMobile ? "900px" : isTablet ? "800px" : "100%",
            }}
          >
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
              margin={{
                left: 80,
                right: 10,
                top: 20,
                bottom: 40,
              }}
            />
          </Box>
        </Box>

        {/* Summary Statistics */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-around",
            mt: { xs: 2.5, sm: 3 },
            pt: { xs: 2, sm: 2 },
            borderTop: "1px solid #e5e7eb",
            flexWrap: isMobile ? "wrap" : "nowrap",
            gap: isMobile ? 2 : 0,
          }}
        >
          <Box
            sx={{
              textAlign: "center",
              minWidth: isMobile ? "45%" : "auto",
              flex: isMobile ? "0 0 45%" : "1",
            }}
          >
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ fontSize: { xs: "0.7rem", sm: "0.75rem" } }}
            >
              {t("dashboard.totalWeekRevenue") || "Tổng tuần"}
            </Typography>
            <Typography
              variant={isMobile ? "body1" : "h6"}
              fontWeight="bold"
              color="primary.main"
              sx={{ fontSize: { xs: "0.95rem", sm: "1.1rem", md: "1.25rem" } }}
            >
              $
              {weeklyRevenue
                .reduce((sum: number, day: DayRevenue) => sum + day.revenue, 0)
                .toLocaleString("en-US", {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                })}
            </Typography>
          </Box>
          <Box
            sx={{
              textAlign: "center",
              minWidth: isMobile ? "45%" : "auto",
              flex: isMobile ? "0 0 45%" : "1",
            }}
          >
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ fontSize: { xs: "0.7rem", sm: "0.75rem" } }}
            >
              {t("dashboard.averageDaily") || "Trung bình/ngày"}
            </Typography>
            <Typography
              variant={isMobile ? "body1" : "h6"}
              fontWeight="bold"
              color="success.main"
              sx={{ fontSize: { xs: "0.95rem", sm: "1.1rem", md: "1.25rem" } }}
            >
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
          <Box
            sx={{
              textAlign: "center",
              minWidth: isMobile ? "100%" : "auto",
              flex: isMobile ? "0 0 100%" : "1",
              mt: isMobile ? 1 : 0,
            }}
          >
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ fontSize: { xs: "0.7rem", sm: "0.75rem" } }}
            >
              {t("dashboard.highestDay") || "Cao nhất"}
            </Typography>
            <Typography
              variant={isMobile ? "body1" : "h6"}
              fontWeight="bold"
              color="warning.main"
              sx={{ fontSize: { xs: "0.95rem", sm: "1.1rem", md: "1.25rem" } }}
            >
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
