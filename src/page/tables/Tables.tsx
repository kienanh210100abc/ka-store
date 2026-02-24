import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { fetchRestaurant } from "../../store/restaurantSlice";
import {
  Box,
  CircularProgress,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
} from "@mui/material";
import {
  TableRestaurant,
  People,
  EventSeat,
  CheckCircle,
} from "@mui/icons-material";
import type { Table } from "../../store/restaurantSlice";

type Props = {};

const Tables = (props: Props) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { data, loading, error } = useAppSelector((state) => state.restaurant);

  useEffect(() => {
    dispatch(fetchRestaurant());
  }, [dispatch]);

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "400px",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  const getStatusConfig = (status: Table["status"]) => {
    switch (status) {
      case "EMPTY":
        return {
          label: "Trống",
          color: "#4caf50",
          bgColor: "#e8f5e9",
          icon: <CheckCircle sx={{ color: "#4caf50" }} />,
        };
      case "SERVING":
        return {
          label: "Đang phục vụ",
          color: "#f44336",
          bgColor: "#ffebee",
          icon: <People sx={{ color: "#f44336" }} />,
        };
      case "RESERVED":
        return {
          label: "Đã đặt",
          color: "#ff9800",
          bgColor: "#fff3e0",
          icon: <EventSeat sx={{ color: "#ff9800" }} />,
        };
      default:
        return {
          label: status,
          color: "#9e9e9e",
          bgColor: "#f5f5f5",
          icon: <TableRestaurant sx={{ color: "#9e9e9e" }} />,
        };
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography
        variant="h4"
        sx={{
          mb: 3,
          fontWeight: 600,
          color: "#333",
          display: "flex",
          alignItems: "center",
          gap: 1,
        }}
      >
        <TableRestaurant sx={{ fontSize: 32 }} />
        Quản lý bàn
      </Typography>

      <Box sx={{ mb: 3, display: "flex", gap: 2, flexWrap: "wrap" }}>
        <Chip
          icon={<CheckCircle />}
          label={`Trống: ${data?.tables?.filter((t) => t.status === "EMPTY").length || 0}`}
          sx={{
            bgcolor: "#e8f5e9",
            color: "#4caf50",
            fontWeight: 600,
          }}
        />
        <Chip
          icon={<People />}
          label={`Đang phục vụ: ${data?.tables?.filter((t) => t.status === "SERVING").length || 0}`}
          sx={{
            bgcolor: "#ffebee",
            color: "#f44336",
            fontWeight: 600,
          }}
        />
        <Chip
          icon={<EventSeat />}
          label={`Đã đặt: ${data?.tables?.filter((t) => t.status === "RESERVED").length || 0}`}
          sx={{
            bgcolor: "#fff3e0",
            color: "#ff9800",
            fontWeight: 600,
          }}
        />
      </Box>

      <Grid container spacing={3}>
        {data?.tables?.map((table) => {
          const statusConfig = getStatusConfig(table.status);
          return (
            <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={table.id}>
              <Card
                sx={{
                  height: "100%",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  border: `2px solid ${statusConfig.color}`,
                  bgcolor: statusConfig.bgColor,
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: `0 8px 20px ${statusConfig.color}40`,
                  },
                }}
              >
                <CardContent>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      mb: 2,
                    }}
                  >
                    <Typography
                      variant="h5"
                      sx={{
                        fontWeight: 700,
                        color: statusConfig.color,
                      }}
                    >
                      {table.name}
                    </Typography>
                    {statusConfig.icon}
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      mb: 1,
                    }}
                  >
                    <People sx={{ fontSize: 20, color: "#666" }} />
                    <Typography sx={{ color: "#666" }}>
                      Sức chứa: <strong>{table.capacity}</strong> người
                    </Typography>
                  </Box>

                  <Chip
                    label={statusConfig.label}
                    size="small"
                    sx={{
                      mt: 1,
                      bgcolor: statusConfig.color,
                      color: "white",
                      fontWeight: 600,
                      width: "100%",
                    }}
                  />
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

export default Tables;
