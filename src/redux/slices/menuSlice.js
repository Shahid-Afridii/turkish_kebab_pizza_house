import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api"; // ✅ Import API from centralized API file

// Async thunk to fetch menu data
export const fetchMenuData = createAsyncThunk("menu/fetchMenu", async () => {
  try {
    const response = await api.get("/menu/menu"); // ✅ Fetch data from API
    return response.data.status ? response.data.data : [];
  } catch (error) {
    console.error("Error fetching menu:", error);
    throw error; // ✅ Ensures proper error handling in Redux state
  }
});

const menuSlice = createSlice({
  name: "menu",
  initialState: {
    menu: [],
    status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMenuData.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchMenuData.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.menu = action.payload;
      })
      .addCase(fetchMenuData.rejected, (state) => {
        state.status = "failed";
      });
  },
});

export default menuSlice.reducer;
