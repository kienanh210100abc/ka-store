import {
  Close as CloseIcon,
  People,
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
  Grid,
  Typography,
} from "@mui/material";
import type { Table } from "../../store/restaurantSlice";
import { useTranslation } from "react-i18next";
import { useTableDetail } from "./useTableDetail";
import { getStatusConfig } from "./tableConfig";
import CheckInForm from "./CheckInForm";
import PaymentForm from "./PaymentForm";
import TableActions from "./TableActions";

type Props = {
  open: boolean;
  onClose: () => void;
  table: Table | null;
};

const Detail = ({ open, onClose, table }: Props) => {
  const { t } = useTranslation();

  const {
    statusTable,
    customerCount,
    setCustomerCount,
    showCustomerInput,
    buffetPrice,
    setBuffetPrice,
    showPayment,
    orderInfo,
    handleCheckIn,
    handleConfirmCheckIn,
    handleCancelCheckIn,
    handlePayment,
    handleConfirmPayment,
    handleCancelPayment,
  } = useTableDetail(table, onClose);

  if (!table) return null;

  const statusConfig = getStatusConfig(statusTable);
  const StatusIcon = statusConfig.icon;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2, border: `3px solid ${statusConfig.color}` },
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
              icon={<StatusIcon sx={{ color: statusConfig.iconColor }} />}
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
            <CheckInForm
              customerCount={customerCount}
              setCustomerCount={setCustomerCount}
              buffetPrice={buffetPrice}
              setBuffetPrice={setBuffetPrice}
              capacity={table.capacity}
              onConfirm={handleConfirmCheckIn}
              onCancel={handleCancelCheckIn}
            />
          )}

          {showPayment && (
            <PaymentForm
              orderInfo={orderInfo}
              onConfirm={handleConfirmPayment}
              onCancel={handleCancelPayment}
            />
          )}

          {!showCustomerInput && !showPayment && (
            <TableActions
              statusTable={statusTable}
              onCheckIn={handleCheckIn}
              onPayment={handlePayment}
            />
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
