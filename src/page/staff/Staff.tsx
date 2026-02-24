import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { fetchAllStaff } from "../../store/staffSlice";
import {
  Box,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Grid,
  Typography,
  Avatar,
} from "@mui/material";
import { People, Email, Phone, Business } from "@mui/icons-material";

type Props = {};

const Staff = (props: Props) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  // Lấy data từ Redux store
  const { data, loading, error } = useAppSelector((state) => state.staff);

  useEffect(() => {
    // Dispatch async thunk để fetch staff
    dispatch(fetchAllStaff());
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
        <People sx={{ fontSize: 32 }} />
        Quản lý nhân viên ({data?.length || 0})
      </Typography>

      <Grid container spacing={3}>
        {data?.map((staff) => (
          <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={staff.id}>
            <Card
              sx={{
                height: "100%",
                cursor: "pointer",
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
                },
              }}
            >
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    mb: 2,
                  }}
                >
                  <Avatar
                    src={staff.avatar}
                    sx={{
                      width: 80,
                      height: 80,
                      mb: 2,
                      border: "3px solid #667eea",
                    }}
                  >
                    {staff.name.charAt(0)}
                  </Avatar>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 600, textAlign: "center" }}
                  >
                    {staff.name}
                  </Typography>
                </Box>

                <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Email sx={{ fontSize: 18, color: "#666" }} />
                    <Typography variant="body2" sx={{ color: "#666" }}>
                      {staff.email}
                    </Typography>
                  </Box>

                  {staff.phoneNumber && (
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Phone sx={{ fontSize: 18, color: "#666" }} />
                      <Typography variant="body2" sx={{ color: "#666" }}>
                        {staff.phoneNumber}
                      </Typography>
                    </Box>
                  )}

                  {staff.company && (
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Business sx={{ fontSize: 18, color: "#666" }} />
                      <Typography variant="body2" sx={{ color: "#666" }}>
                        {staff.company}
                      </Typography>
                    </Box>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Staff;
