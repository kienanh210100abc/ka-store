import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import { fetchRestaurantData } from "../services/restaurantService";

// Interfaces
export interface Table {
  id: string;
  name: string;
  capacity: number;
  status: "EMPTY" | "SERVING";
}

export interface Order {
  id: string;
  tableId: string;
  customers?: number;
  pricePerPerson?: number;
  total?: number;
  status: "OPEN" | "PAID" | "CANCELLED";
  createdAt: number;
}

export interface RestaurantData {
  id: string;
  tables: Table[];
  orders: Order[];
}

interface RestaurantState {
  data: RestaurantData | null;
  loading: boolean;
  error: string | null;
}

const initialState: RestaurantState = {
  data: null,
  loading: false,
  error: null,
};

// Async thunk để fetch dữ liệu
export const fetchRestaurant = createAsyncThunk(
  "restaurant/fetchRestaurant",
  async () => {
    const response = await fetchRestaurantData();
    // API trả về array, lấy phần tử đầu tiên
    return response[0];
  },
);

const restaurantSlice = createSlice({
  name: "restaurant",
  initialState,
  reducers: {
    // Tables actions
    addTable: (state, action: PayloadAction<Table>) => {
      if (state.data) {
        state.data.tables.push(action.payload);
      }
    },
    updateTable: (state, action: PayloadAction<Table>) => {
      if (state.data) {
        const index = state.data.tables.findIndex(
          (t) => t.id === action.payload.id,
        );
        if (index !== -1) {
          state.data.tables[index] = action.payload;
        }
      }
    },
    deleteTable: (state, action: PayloadAction<string>) => {
      if (state.data) {
        state.data.tables = state.data.tables.filter(
          (t) => t.id !== action.payload,
        );
      }
    },

    // Order actions
    addOrder: (state, action: PayloadAction<Order>) => {
      if (state.data) {
        state.data.orders.push(action.payload);
      }
    },
    updateOrder: (state, action: PayloadAction<Order>) => {
      if (state.data) {
        const index = state.data.orders.findIndex(
          (o) => o.id === action.payload.id,
        );
        if (index !== -1) {
          state.data.orders[index] = action.payload;
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRestaurant.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRestaurant.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchRestaurant.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch restaurant data";
      });
  },
});

export const { addTable, updateTable, deleteTable, addOrder, updateOrder } =
  restaurantSlice.actions;

export default restaurantSlice.reducer;
