import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

// Fetch shop settings
export const fetchShopSettings = createAsyncThunk(
  "shop/fetchSettings",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/client/shop/settings");
      if (response.status === 200 && response.data?.status) {
        return response.data;
      }
      throw new Error(response.data?.message || "Failed to fetch shop settings");
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch shop settings");
    }
  }
);

const shopSlice = createSlice({
  name: "shop",
  initialState: {
    shop: null,
    shopTimings: [],
    policy: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchShopSettings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchShopSettings.fulfilled, (state, action) => {
        state.loading = false;
        state.shop = action.payload.shop;
        state.shopTimings = action.payload.shopTimimngs;
        state.policy = action.payload.policy;
      })
      .addCase(fetchShopSettings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default shopSlice.reducer;
