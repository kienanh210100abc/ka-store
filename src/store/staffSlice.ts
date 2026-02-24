import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchStaff } from "../services/profileService";
import type { Profile } from "../services/profileService";

interface StaffState {
  data: Profile[];
  loading: boolean;
  error: string | null;
}

const initialState: StaffState = {
  data: [],
  loading: false,
  error: null,
};

// Async thunk để fetch staff
export const fetchAllStaff = createAsyncThunk(
  "staff/fetchAllStaff",
  async () => {
    const response = await fetchStaff.getAllStaff();
    return response;
  },
);

const staffSlice = createSlice({
  name: "staff",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllStaff.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllStaff.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchAllStaff.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch staff";
      });
  },
});

export default staffSlice.reducer;
