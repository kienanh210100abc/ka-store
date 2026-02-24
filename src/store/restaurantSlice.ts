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
  status: "EMPTY" | "SERVING" | "RESERVED";
}

export interface RestaurantData {
  id: string;
  tables: Table[];
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

    // Categories actions
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

export const { addTable, updateTable, deleteTable } = restaurantSlice.actions;

export default restaurantSlice.reducer;
