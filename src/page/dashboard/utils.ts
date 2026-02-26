export const formatCurrency = (amount: number) => {
  return amount.toLocaleString("it-IT", { style: "currency", currency: "VND" });
};

export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const getStatusColor = (status: string) => {
  switch (status) {
    case "PAID":
      return "success";
    case "PENDING":
      return "warning";
    case "CHECKED_IN":
      return "info";
    default:
      return "default";
  }
};
