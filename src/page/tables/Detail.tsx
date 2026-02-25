import {
  CheckCircle,
  Close as CloseIcon,
  Edit,
  Payment,
  People,
  PersonAdd,
  TableRestaurant,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControlLabel,
  Grid,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from "@mui/material";
import type { Table, Order } from "../../store/restaurantSlice";
import {
  updateTable,
  addOrder,
  updateOrder,
} from "../../store/restaurantSlice";
import {
  createOrder,
  updateOrderStatus,
} from "../../services/restaurantService";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";

type Props = {
  open: boolean;
  onClose: () => void;
  table: Table | null;
};

const API = "https://693a6dea9b80ba7262c9e0fe.mockapi.io/restaurant/1";

const Detail = ({ open, onClose, table }: Props) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { data } = useAppSelector((state) => state.restaurant);

  const [statusTable, setStatusTable] = useState<Table["status"]>("EMPTY");
  const [customerCount, setCustomerCount] = useState<number>(1);
  const [showCustomerInput, setShowCustomerInput] = useState(false);
  const [buffetPrice, setBuffetPrice] = useState<number>(139000);
  const [showPayment, setShowPayment] = useState(false);
  const [currentOrderId, setCurrentOrderId] = useState<string | null>(null);
  const [orderInfo, setOrderInfo] = useState<{
    customers: number;
    pricePerPerson: number;
    total: number;
  } | null>(null);

  // 🔹 sync khi đổi bàn
  useEffect(() => {
    if (table) {
      setStatusTable(table.status);
      setCustomerCount(1);
      setShowCustomerInput(false);
      setBuffetPrice(139000);
      setShowPayment(false);

      // Tìm order đang OPEN của bàn này
      const tableOrder = data?.orders?.find(
        (order) => order.tableId === table.id && order.status === "OPEN",
      );

      if (tableOrder) {
        setCurrentOrderId(tableOrder.id);
        setOrderInfo({
          customers: tableOrder.customers,
          pricePerPerson: tableOrder.pricePerPerson,
          total: tableOrder.total,
        });
      } else {
        setCurrentOrderId(null);
        setOrderInfo(null);
      }
    }
  }, [table, data?.orders]);

  if (!table) return null;

  // 🔹 API update table status theo table.id
  const updateTableStatusAPI = async (newStatus: Table["status"]) => {
    try {
      const res = await fetch(API);
      const restaurant = await res.json();

      const updatedTables = restaurant.tables.map((t: Table) =>
        t.id === table.id ? { ...t, status: newStatus } : t,
      );

      await fetch(API, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...restaurant, tables: updatedTables }),
      });

      dispatch(updateTable({ ...table, status: newStatus }));
      setStatusTable(newStatus);
    } catch (err) {
      console.error("Update table failed:", err);
    }
  };

  const handleCheckIn = () => setShowCustomerInput(true);

  const handleConfirmCheckIn = async () => {
    try {
      const orderData = {
        tableId: table.id,
        customers: customerCount,
        pricePerPerson: buffetPrice,
        total: customerCount * buffetPrice,
      };

      // Tạo order trong API
      const newOrder = await createOrder(orderData);

      // Thêm vào Redux store
      dispatch(addOrder(newOrder));

      // Lưu orderInfo và orderId
      setCurrentOrderId(newOrder.id);
      setOrderInfo({
        customers: orderData.customers,
        pricePerPerson: orderData.pricePerPerson,
        total: orderData.total,
      });

      // Cập nhật trạng thái bàn
      await updateTableStatusAPI("SERVING");
      setShowCustomerInput(false);
      onClose();
    } catch (err) {
      console.error("Failed to check in:", err);
    }
  };

  const handleCancelCheckIn = () => {
    setShowCustomerInput(false);
    setCustomerCount(1);
    setBuffetPrice(139000);
  };

  const handlePayment = () => {
    // Nếu chưa có orderInfo, load từ store
    if (!orderInfo && data?.orders) {
      const tableOrder = data.orders.find(
        (order) => order.tableId === table.id && order.status === "OPEN",
      );

      if (tableOrder) {
        setCurrentOrderId(tableOrder.id);
        setOrderInfo({
          customers: tableOrder.customers,
          pricePerPerson: tableOrder.pricePerPerson,
          total: tableOrder.total,
        });
      } else {
        // Nếu không có order, tạo mặc định
        setOrderInfo({
          customers: 1,
          pricePerPerson: 139000,
          total: 139000,
        });
      }
    }
    setShowPayment(true);
  };

  const handleConfirmPayment = async () => {
    try {
      console.log("Payment confirmed for table:", table.id, orderInfo);

      // Cập nhật order status thành PAID
      if (currentOrderId) {
        await updateOrderStatus(currentOrderId, "PAID");

        // Cập nhật trong Redux store
        const currentOrder = data?.orders?.find((o) => o.id === currentOrderId);
        if (currentOrder) {
          dispatch(updateOrder({ ...currentOrder, status: "PAID" }));
        }
      }

      // Đổi trạng thái bàn về EMPTY
      await updateTableStatusAPI("EMPTY");

      setShowPayment(false);
      setOrderInfo(null);
      setCurrentOrderId(null);
      onClose();
    } catch (err) {
      console.error("Payment failed:", err);
    }
  };

  const handleCancelPayment = () => {
    setShowPayment(false);
  };

  // 🔹 config status (giữ UI cũ)
  const getStatusConfig = (status: Table["status"]) => {
    switch (status) {
      case "EMPTY":
        return {
          label: t("table.empty"),
          color: "#4caf50",
          bgColor: "#e8f5e9",
          icon: <CheckCircle sx={{ color: "#4caf50" }} />,
        };
      case "SERVING":
        return {
          label: t("table.serving"),
          color: "#f44336",
          bgColor: "#ffebee",
          icon: <People sx={{ color: "#f44336" }} />,
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

  const statusConfig = getStatusConfig(statusTable);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          border: `3px solid ${statusConfig.color}`,
        },
      }}
    >
      <DialogTitle
        sx={{
          bgcolor: statusConfig.bgColor,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          pb: 2,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <TableRestaurant sx={{ fontSize: 32, color: statusConfig.color }} />
          <Box>
            <Typography
              variant="h5"
              sx={{ fontWeight: 700, color: statusConfig.color }}
            >
              {table.name}
            </Typography>
            <Chip
              label={statusConfig.label}
              size="small"
              icon={statusConfig.icon}
              sx={{
                mt: 0.5,
                bgcolor: statusConfig.color,
                color: "white",
                fontWeight: 600,
              }}
            />
          </Box>
        </Box>
        <CloseIcon
          onClick={onClose}
          sx={{ cursor: "pointer", color: "#666" }}
        />
      </DialogTitle>

      <DialogContent sx={{ mt: 2 }}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                p: 2,
                bgcolor: "#f5f5f5",
                borderRadius: 1,
              }}
            >
              <People sx={{ fontSize: 24, color: "#666" }} />
              <Typography sx={{ color: "#666" }}>
                {t("table.capacity")} <strong>{table.capacity}</strong>
              </Typography>
            </Box>
          </Grid>

          {showCustomerInput && (
            <>
              <Grid size={{ xs: 12 }}>
                <Divider sx={{ my: 1 }} />
                <Typography
                  variant="h6"
                  sx={{ mb: 2, fontWeight: 600, color: "#2196f3" }}
                >
                  {t("table.enterCustomerCount")}
                </Typography>
              </Grid>

              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  type="number"
                  label={t("table.enterCustomerCount")}
                  value={customerCount}
                  onChange={(e) =>
                    setCustomerCount(
                      Math.max(
                        1,
                        Math.min(table.capacity, parseInt(e.target.value) || 1),
                      ),
                    )
                  }
                  inputProps={{ min: 1, max: table.capacity }}
                  helperText={`Tối đa: ${table.capacity} người`}
                  autoFocus
                />
              </Grid>

              <Grid size={{ xs: 12 }}>
                <Typography
                  variant="subtitle1"
                  sx={{ mb: 1, fontWeight: 600, color: "#333" }}
                >
                  Chọn gói buffet
                </Typography>
                <RadioGroup
                  value={buffetPrice}
                  onChange={(e) => setBuffetPrice(Number(e.target.value))}
                >
                  <FormControlLabel
                    value={139000}
                    control={<Radio />}
                    label={
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          width: "100%",
                          pr: 2,
                        }}
                      >
                        <Typography>Buffet Cơ Bản</Typography>
                        <Typography sx={{ fontWeight: 600, color: "#2196f3" }}>
                          139.000đ
                        </Typography>
                      </Box>
                    }
                    sx={{
                      border: "1px solid #e0e0e0",
                      borderRadius: 1,
                      mb: 1,
                      mx: 0,
                      px: 2,
                      py: 1,
                      "&:hover": { bgcolor: "#f5f5f5" },
                    }}
                  />
                  <FormControlLabel
                    value={299000}
                    control={<Radio />}
                    label={
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          width: "100%",
                          pr: 2,
                        }}
                      >
                        <Typography>Buffet Cao Cấp</Typography>
                        <Typography sx={{ fontWeight: 600, color: "#ff9800" }}>
                          299.000đ
                        </Typography>
                      </Box>
                    }
                    sx={{
                      border: "1px solid #e0e0e0",
                      borderRadius: 1,
                      mb: 1,
                      mx: 0,
                      px: 2,
                      py: 1,
                      "&:hover": { bgcolor: "#f5f5f5" },
                    }}
                  />
                  <FormControlLabel
                    value={499000}
                    control={<Radio />}
                    label={
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          width: "100%",
                          pr: 2,
                        }}
                      >
                        <Typography>Buffet VIP</Typography>
                        <Typography sx={{ fontWeight: 600, color: "#f44336" }}>
                          499.000đ
                        </Typography>
                      </Box>
                    }
                    sx={{
                      border: "1px solid #e0e0e0",
                      borderRadius: 1,
                      mx: 0,
                      px: 2,
                      py: 1,
                      "&:hover": { bgcolor: "#f5f5f5" },
                    }}
                  />
                </RadioGroup>
              </Grid>

              <Grid size={{ xs: 12 }}>
                <Box
                  sx={{
                    p: 2,
                    bgcolor: "#e3f2fd",
                    borderRadius: 1,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Tổng cộng:
                  </Typography>
                  <Typography
                    variant="h5"
                    sx={{ fontWeight: 700, color: "#2196f3" }}
                  >
                    {(customerCount * buffetPrice).toLocaleString("vi-VN")}đ
                  </Typography>
                </Box>
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <Button
                  fullWidth
                  variant="contained"
                  onClick={handleConfirmCheckIn}
                  disabled={customerCount < 1 || customerCount > table.capacity}
                  sx={{ bgcolor: "#4caf50", py: 1.5 }}
                >
                  {t("button.confirm")}
                </Button>
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={handleCancelCheckIn}
                  sx={{ borderColor: "#f44336", color: "#f44336", py: 1.5 }}
                >
                  {t("button.cancel")}
                </Button>
              </Grid>
            </>
          )}

          {showPayment && (
            <>
              <Grid size={{ xs: 12 }}>
                <Divider sx={{ my: 1 }} />
                <Typography
                  variant="h6"
                  sx={{ mb: 2, fontWeight: 600, color: "#4caf50" }}
                >
                  Thanh toán
                </Typography>
              </Grid>

              <Grid size={{ xs: 12 }}>
                <Box
                  sx={{
                    p: 2,
                    bgcolor: "#f5f5f5",
                    borderRadius: 1,
                    mb: 2,
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 1,
                    }}
                  >
                    <Typography sx={{ color: "#666" }}>Số khách:</Typography>
                    <Typography sx={{ fontWeight: 600 }}>
                      {orderInfo?.customers || 1} người
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 1,
                    }}
                  >
                    <Typography sx={{ color: "#666" }}>
                      Giá buffet/người:
                    </Typography>
                    <Typography sx={{ fontWeight: 600 }}>
                      {(orderInfo?.pricePerPerson || 139000).toLocaleString(
                        "vi-VN",
                      )}
                      đ
                    </Typography>
                  </Box>
                  <Divider sx={{ my: 1 }} />
                  <Box
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                      Tổng cộng:
                    </Typography>
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: 700, color: "#4caf50" }}
                    >
                      {(orderInfo?.total || 139000).toLocaleString("vi-VN")}đ
                    </Typography>
                  </Box>
                </Box>
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <Button
                  fullWidth
                  variant="contained"
                  onClick={handleConfirmPayment}
                  sx={{ bgcolor: "#4caf50", py: 1.5 }}
                >
                  Xác nhận thanh toán
                </Button>
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={handleCancelPayment}
                  sx={{ borderColor: "#f44336", color: "#f44336", py: 1.5 }}
                >
                  Hủy
                </Button>
              </Grid>
            </>
          )}

          {!showCustomerInput && !showPayment && statusTable === "EMPTY" && (
            <>
              <Grid size={{ xs: 12, sm: 12 }}>
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<PersonAdd />}
                  onClick={handleCheckIn}
                  sx={{
                    bgcolor: "#2196f3",
                    py: 1.5,
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  {t("table.checkIn")}
                </Button>
              </Grid>
            </>
          )}

          {!showCustomerInput && !showPayment && statusTable === "SERVING" && (
            <>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<Payment />}
                  onClick={handlePayment}
                  sx={{ bgcolor: "#4caf50", py: 1.5 }}
                >
                  {t("table.payment")}
                </Button>
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<Edit />}
                  sx={{ borderColor: "#2196f3", color: "#2196f3", py: 1.5 }}
                >
                  {t("table.editOrder")}
                </Button>
              </Grid>
            </>
          )}
        </Grid>
      </DialogContent>

      <DialogActions sx={{ p: 2, pt: 0 }}>
        <Button onClick={onClose} variant="text" sx={{ color: "#666" }}>
          {t("button.close")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default Detail;
