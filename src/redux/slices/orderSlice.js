import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api"; // Ensure this points to your API service

// ✅ Submit Order
export const submitOrder = createAsyncThunk(
  "order/submit",
  async (orderData, { rejectWithValue }) => {
    try {
      const response = await api.post("/client/order/submit", orderData);

      if ((response.status === 200 || response.status === 201) && response.data?.status) {
        return response.data;
      }

      throw new Error(response.data?.message || "Failed to submit order");
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Error submitting order");
    }
  }
);

// ✅ Get Orders
export const getOrders = createAsyncThunk(
  "order/getAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/client/order");

      if (response.status === 200 && response.data?.status) {
        return response.data.data; // Assuming the orders are in `data.data`
      }

      throw new Error(response.data?.message || "Failed to fetch orders");
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Error fetching orders");
    }
  }
);

// ✅ Order Slice
const orderSlice = createSlice({
  name: "order",
  initialState: {
    orderDetails: null,
    orderList: [],
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Submit Order
      .addCase(submitOrder.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(submitOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderDetails = action.payload;
        state.error = null;
      })
      .addCase(submitOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Get Orders
      .addCase(getOrders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderList = action.payload;
        state.error = null;
      })
      .addCase(getOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export default orderSlice.reducer;
