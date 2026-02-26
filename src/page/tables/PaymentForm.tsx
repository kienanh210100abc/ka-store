import { Box, Button, Divider, Grid, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

type OrderInfo = {
  customers: number;
  pricePerPerson: number;
  total: number;
};

type Props = {
  orderInfo: OrderInfo | null;
  onConfirm: () => void;
  onCancel: () => void;
};

const PaymentForm = ({ orderInfo, onConfirm, onCancel }: Props) => {
  const { t } = useTranslation();
  return (
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
        <Box sx={{ p: 2, bgcolor: "#f5f5f5", borderRadius: 1, mb: 2 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
            <Typography sx={{ color: "#666" }}>
              {t("table.customerCount")}:
            </Typography>
            <Typography sx={{ fontWeight: 600 }}>
              {orderInfo?.customers || 1} {t("table.people")}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
            <Typography sx={{ color: "#666" }}>
              {t("table.pricePerPerson")}:
            </Typography>
            <Typography sx={{ fontWeight: 600 }}>
              {(orderInfo?.pricePerPerson || 139000).toLocaleString("vi-VN")}đ
            </Typography>
          </Box>
          <Divider sx={{ my: 1 }} />
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Tổng cộng:
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 700, color: "#4caf50" }}>
              {(orderInfo?.total || 139000).toLocaleString("vi-VN")}đ
            </Typography>
          </Box>
        </Box>
      </Grid>

      <Grid size={{ xs: 12, sm: 6 }}>
        <Button
          fullWidth
          variant="contained"
          onClick={onConfirm}
          sx={{ bgcolor: "#4caf50", py: 1.5 }}
        >
          {t("button.confirm")}
        </Button>
      </Grid>

      <Grid size={{ xs: 12, sm: 6 }}>
        <Button
          fullWidth
          variant="outlined"
          onClick={onCancel}
          sx={{ borderColor: "#f44336", color: "#f44336", py: 1.5 }}
        >
          {t("button.cancel")}
        </Button>
      </Grid>
    </>
  );
};

export default PaymentForm;
