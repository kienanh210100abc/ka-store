const BASE_URL = "https://693a6dea9b80ba7262c9e0fe.mockapi.io";

export const fetchRestaurantData = async () => {
  const response = await fetch(`${BASE_URL}/restaurant`);
  if (!response.ok) {
    throw new Error("Failed to fetch restaurant data");
  }
  return response.json();
};

export const updateTableStatus = async (tableId: string, status: string) => {
  // Fetch current restaurant data
  const restaurantData = await fetchRestaurantData();
  const restaurant = restaurantData[0];

  console.log("Current restaurant:", restaurant);
  console.log("Updating table", tableId, "to status", status);

  // Find and update the table
  const updatedTables = restaurant.tables.map((table: any) => {
    if (table.id === tableId) {
      return { ...table, status };
    }
    return table;
  });

  const updatedRestaurant = {
    ...restaurant,
    tables: updatedTables,
  };

  console.log("Updated restaurant data:", updatedRestaurant);

  // PUT back the entire restaurant object with updated tables
  const response = await fetch(`${BASE_URL}/restaurant/${restaurant.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedRestaurant),
  });

  console.log("Update response status:", response.status);

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Update failed:", errorText);
    throw new Error("Failed to update table status");
  }

  const result = await response.json();
  console.log("Update result:", result);
  return result;
};

// Keep old function for backward compatibility
export const getDetailTable = async (tableId: string, status: string) => {
  return updateTableStatus(tableId, status);
};

export const createOrder = async (orderData: {
  tableId: string;
  customers?: any;
  pricePerPerson?: any;
  total?: any;
}) => {
  const restaurantData = await fetchRestaurantData();
  const restaurant = restaurantData[0];

  const newOrder = {
    id: String(Date.now()),
    ...orderData,
    status: "OPEN",
    createdAt: Date.now(),
  };

  const updatedRestaurant = {
    ...restaurant,
    orders: [...(restaurant.orders || []), newOrder],
  };

  const response = await fetch(`${BASE_URL}/restaurant/${restaurant.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedRestaurant),
  });

  if (!response.ok) {
    throw new Error("Failed to create order");
  }

  return newOrder;
};

export const updateOrderStatus = async (orderId: string, status: string) => {
  const restaurantData = await fetchRestaurantData();
  const restaurant = restaurantData[0];

  const updatedOrders = (restaurant.orders || []).map((order: any) => {
    if (order.id === orderId) {
      return { ...order, status };
    }
    return order;
  });

  const updatedRestaurant = {
    ...restaurant,
    orders: updatedOrders,
  };

  const response = await fetch(`${BASE_URL}/restaurant/${restaurant.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedRestaurant),
  });

  if (!response.ok) {
    throw new Error("Failed to update order status");
  }

  return response.json();
};
