import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  updateTable,
  addOrder,
  updateOrder,
} from "../../store/restaurantSlice";
import {
  createOrder,
  updateOrderStatus,
} from "../../services/restaurantService";
import type { Table } from "../../store/restaurantSlice";
import { API } from "./tableConfig";

type OrderInfo = {
  customers: number;
  pricePerPerson: number;
  total: number;
};

export const useTableDetail = (table: Table | null, onClose: () => void) => {
  const dispatch = useAppDispatch();
  const { data } = useAppSelector((state) => state.restaurant);

  // Trạng thái bàn: "EMPTY" | "SERVING"
  const [statusTable, setStatusTable] = useState<Table["status"]>("EMPTY");
  // Số khách nhập vào
  const [customerCount, setCustomerCount] = useState<number>(1);
  // Hiển thị form Checkin
  const [showCustomerInput, setShowCustomerInput] = useState(false);
  // Gói buffet chọn
  const [buffetPrice, setBuffetPrice] = useState<number>(139000);
  // Hiển thị form Thanh toán
  const [showPayment, setShowPayment] = useState(false);
  // ID order đang mở của bàn
  const [currentOrderId, setCurrentOrderId] = useState<string | null>(null);
  // Thông tin order (số khách, giá, tổng)
  const [orderInfo, setOrderInfo] = useState<OrderInfo | null>(null);

  useEffect(() => {
    if (table) {
      setStatusTable(table.status);
      setCustomerCount(1);
      setShowCustomerInput(false);
      setBuffetPrice(139000);
      setShowPayment(false);

      // Tìm order đang OPEN của bàn này trong Redux store
      const tableOrder = data?.orders?.find(
        (order) => order.tableId === table.id && order.status === "OPEN",
      );

      if (tableOrder) {
        setCurrentOrderId(tableOrder.id);
        setOrderInfo({
          customers: tableOrder.customers || 1,
          pricePerPerson: tableOrder.pricePerPerson || 139000,
          total: tableOrder.total || 139000,
        });
      } else {
        setCurrentOrderId(null);
        setOrderInfo(null);
      }
    }
  }, [table, data?.orders]); // Chạy lại mỗi khi đổi bàn hoặc orders thay đổi

  const updateTableStatusAPI = async (newStatus: Table["status"]) => {
    if (!table) return;
    try {
      // 1. GET toàn bộ data restaurant từ API
      const res = await fetch(API);
      const restaurant = await res.json();

      // 2. Tìm đúng bàn → đổi status
      const updatedTables = restaurant.tables.map((t: Table) =>
        t.id === table.id ? { ...t, status: newStatus } : t,
      );

      // 3. PUT lại toàn bộ restaurant (vì mockAPI dùng 1 object lớn)
      await fetch(API, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...restaurant, tables: updatedTables }),
      });

      // 4. Cập nhật lại status của bàn trong Redux store để UI nhảy
      dispatch(updateTable({ ...table, status: newStatus }));
      setStatusTable(newStatus);
    } catch (err) {
      console.error("Update table failed:", err);
    }
  };

  // Khi Khách vào thì hiện ra input để nhập số khách
  const handleCheckIn = () => setShowCustomerInput(true);

  const handleConfirmCheckIn = async () => {
    if (!table) return;
    try {
      //khởi tạo order mới với thông tin từ form
      const orderData = {
        tableId: table.id,
        customers: customerCount,
        pricePerPerson: buffetPrice,
        total: customerCount * buffetPrice,
      };

      // 1. Tạo order mới trên API
      const newOrder = await createOrder(orderData);
      // 2. Đẩy order vào Redux store
      dispatch(addOrder({ ...newOrder, status: "OPEN" as const }));
      // 3. Lưu lại orderInfo và orderId vào state local
      setCurrentOrderId(newOrder.id);
      setOrderInfo({
        customers: orderData.customers,
        pricePerPerson: orderData.pricePerPerson,
        total: orderData.total,
      });
      // 4. Đổi trạng thái bàn → SERVING
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
    if (!orderInfo && data?.orders) {
      const tableOrder = data.orders.find(
        (order) => order.tableId === table?.id && order.status === "OPEN",
      );
      if (tableOrder) {
        setCurrentOrderId(tableOrder.id);
        setOrderInfo({
          customers: tableOrder.customers || 1,
          pricePerPerson: tableOrder.pricePerPerson || 139000,
          total: tableOrder.total || 139000,
        });
      } else {
        setOrderInfo({ customers: 1, pricePerPerson: 139000, total: 139000 });
      }
    }
    setShowPayment(true);
  };

  const handleConfirmPayment = async () => {
    try {
      if (currentOrderId) {
        // 1. Đổi status order → PAID trên API
        await updateOrderStatus(currentOrderId, "PAID");
        const currentOrder = data?.orders?.find((o) => o.id === currentOrderId);
        if (currentOrder) {
          // 2. Sync Redux
          dispatch(updateOrder({ ...currentOrder, status: "PAID" }));
        }
      }
      // 3. Đổi bàn về EMPTY
      await updateTableStatusAPI("EMPTY");
      setShowPayment(false);
      setOrderInfo(null);
      setCurrentOrderId(null);
      onClose();
    } catch (err) {
      console.error("Payment failed:", err);
    }
  };

  const handleCancelPayment = () => setShowPayment(false);

  return {
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
  };
};
