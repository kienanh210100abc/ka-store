import { Edit, Payment, PersonAdd } from "@mui/icons-material";
import { Button, Grid } from "@mui/material";
import { useTranslation } from "react-i18next";
import type { Table } from "../../store/restaurantSlice";

type Props = {
  statusTable: Table["status"];
  onCheckIn: () => void;
  onPayment: () => void;
};

const TableActions = ({ statusTable, onCheckIn, onPayment }: Props) => {
  const { t } = useTranslation();

  if (statusTable === "EMPTY") {
    return (
      <Grid size={{ xs: 12 }}>
        <Button
          fullWidth
          variant="contained"
          startIcon={<PersonAdd />}
          onClick={onCheckIn}
          sx={{ bgcolor: "#2196f3", py: 1.5 }}
        >
          {t("table.checkIn")}
        </Button>
      </Grid>
    );
  }

  if (statusTable === "SERVING") {
    return (
      <>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Button
            fullWidth
            variant="contained"
            startIcon={<Payment />}
            onClick={onPayment}
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
    );
  }

  return null;
};

export default TableActions;
