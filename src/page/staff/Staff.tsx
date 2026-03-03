import { useEffect, useMemo, useState } from "react";
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
  TextField,
  InputAdornment,
  Pagination,
} from "@mui/material";
import { People, Email, Phone, Business, Search } from "@mui/icons-material";
import { useSearchParams } from "react-router-dom";
import type { Profile } from "../../services/profileService";
import StaffDetail from "./StaffDetail";

const ITEMS_PER_PAGE = 8;

const Staff = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const [searchParams] = useSearchParams();
  const roleFilter = searchParams.get("role");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedStaff, setSelectedStaff] = useState<Profile | null>(null);
  const [openDetail, setOpenDetail] = useState(false);

  // Lấy data từ Redux store
  const { data, loading, error } = useAppSelector((state) => state.staff);

  // Lọc data theo role và search query
  const filteredData = useMemo(() => {
    if (!data) return [];

    let filtered = data;

    // Lọc theo role
    if (roleFilter) {
      filtered = filtered.filter((staff) => staff.role === roleFilter);
    }

    // Lọc theo search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (staff) =>
          staff.name.toLowerCase().includes(query) ||
          staff.email.toLowerCase().includes(query) ||
          staff.phoneNumber?.toLowerCase().includes(query) ||
          staff.company?.toLowerCase().includes(query),
      );
    }

    return filtered;
  }, [data, roleFilter, searchQuery]);

  // Tính toán pagination
  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredData.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredData, currentPage]);

  // Reset về trang 1 khi filter hoặc search thay đổi
  useEffect(() => {
    setCurrentPage(1);
  }, [roleFilter, searchQuery]);

  useEffect(() => {
    // Dispatch async thunk để fetch staff
    dispatch(fetchAllStaff());
  }, [dispatch]);

  const handleOpenDetail = (staff: Profile) => {
    setSelectedStaff(staff);
    setOpenDetail(true);
  };

  const handleCloseDetail = () => {
    setOpenDetail(false);
    setSelectedStaff(null);
  };

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
      <Box
        sx={{
          mb: 3,
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          justifyContent: "space-between",
          alignItems: { xs: "flex-start", md: "center" },
          gap: 2,
        }}
      >
        <Typography
          variant="h4"
          sx={{
            fontWeight: 600,
            color: "#333",
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <People sx={{ fontSize: 32 }} />
          {roleFilter === "ADMIN"
            ? "Danh sách Quản lý"
            : roleFilter === "USER"
              ? "Danh sách Nhân viên"
              : t("staff.title")}{" "}
          ({filteredData?.length || 0})
        </Typography>

        <TextField
          placeholder={t("profile.searchStaff")}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          size="small"
          sx={{
            width: { xs: "100%", md: "300px" },
            "& .MuiOutlinedInput-root": {
              backgroundColor: "white",
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search sx={{ color: "#666" }} />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      <Grid container spacing={3}>
        {paginatedData?.map((staff) => (
          <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={staff.id}>
            <Card
              onClick={() => handleOpenDetail(staff)}
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
                  {staff.role && (
                    <Chip
                      label={
                        staff.role === "ADMIN"
                          ? t("staff.admin")
                          : t("staff.employee")
                      }
                      size="small"
                      sx={{
                        mt: 1,
                        backgroundColor:
                          staff.role === "ADMIN" ? "#667eea" : "#4caf50",
                        color: "white",
                        fontWeight: 600,
                      }}
                    />
                  )}
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

      {totalPages > 1 && (
        <Box
          sx={{
            mt: 4,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={(_, page) => setCurrentPage(page)}
            color="primary"
            size="large"
            showFirstButton
            showLastButton
            sx={{
              "& .MuiPaginationItem-root": {
                fontWeight: 500,
              },
            }}
          />
        </Box>
      )}

      {filteredData.length === 0 && !loading && (
        <Box
          sx={{
            textAlign: "center",
            py: 8,
          }}
        >
          <Typography variant="h6" color="text.secondary">
            {searchQuery
              ? "Không tìm thấy kết quả phù hợp"
              : "Không có dữ liệu"}
          </Typography>
        </Box>
      )}

      <StaffDetail
        open={openDetail}
        onClose={handleCloseDetail}
        staff={selectedStaff}
      />
    </Box>
  );
};

export default Staff;
