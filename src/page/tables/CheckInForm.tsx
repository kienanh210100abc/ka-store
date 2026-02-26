import {
  Box,
  Button,
  Divider,
  FormControlLabel,
  Grid,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { BUFFET_PACKAGES } from "./tableConfig";

type Props = {
  customerCount: number;
  setCustomerCount: (val: number) => void;
  buffetPrice: number;
  setBuffetPrice: (val: number) => void;
  capacity: number;
  onConfirm: () => void;
  onCancel: () => void;
};

const CheckInForm = ({
  customerCount,
  setCustomerCount,
  buffetPrice,
  setBuffetPrice,
  capacity,
  onConfirm,
  onCancel,
}: Props) => {
  const { t } = useTranslation();

  return (
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
              Math.max(1, Math.min(capacity, parseInt(e.target.value) || 1)),
            )
          }
          inputProps={{ min: 1, max: capacity }}
          autoFocus
        />
      </Grid>

      <Grid size={{ xs: 12 }}>
        <Typography
          variant="subtitle1"
          sx={{ mb: 1, fontWeight: 600, color: "#333" }}
        >
          {t("table.selectBuffetPackage")}
        </Typography>
        <RadioGroup
          value={buffetPrice}
          onChange={(e) => setBuffetPrice(Number(e.target.value))}
        >
          {BUFFET_PACKAGES.map((pkg) => (
            <FormControlLabel
              key={pkg.value}
              value={pkg.value}
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
                  <Typography>{pkg.label}</Typography>
                  <Typography sx={{ fontWeight: 600, color: pkg.color }}>
                    {pkg.value.toLocaleString("vi-VN")}đ
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
          ))}
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
          <Typography variant="h5" sx={{ fontWeight: 700, color: "#2196f3" }}>
            {(customerCount * buffetPrice).toLocaleString("vi-VN")}đ
          </Typography>
        </Box>
      </Grid>

      <Grid size={{ xs: 12, sm: 6 }}>
        <Button
          fullWidth
          variant="contained"
          onClick={onConfirm}
          disabled={customerCount < 1 || customerCount > capacity}
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

export default CheckInForm;
