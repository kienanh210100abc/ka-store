import { CheckCircle, People } from "@mui/icons-material";
import type { Table } from "../../store/restaurantSlice";
import { t } from "i18next";

export const API = "https://693a6dea9b80ba7262c9e0fe.mockapi.io/restaurant/1";

export const BUFFET_PACKAGES = [
  { value: 139000, label: "Buffet Cơ Bản", color: "#2196f3" },
  { value: 299000, label: "Buffet Cao Cấp", color: "#ff9800" },
  { value: 499000, label: "Buffet VIP", color: "#f44336" },
];

export const getStatusConfig = (status: Table["status"]) => {
  switch (status) {
    case "EMPTY":
      return {
        label: t("table.empty"),
        color: "#4caf50",
        bgColor: "#e8f5e9",
        icon: CheckCircle,
        iconColor: "#4caf50",
      };
    case "SERVING":
      return {
        label: t("table.serving"),
        color: "#f44336",
        bgColor: "#ffebee",
        icon: People,
        iconColor: "#f44336",
      };
  }
};
