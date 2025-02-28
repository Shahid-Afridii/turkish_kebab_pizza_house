import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

// ✅ Helper function to validate API response
const validateResponse = (response) => {
  if (response.status === 200 && response.data?.status) {
    return response.data;
  }
  throw new Error(response.data?.message || "Unexpected response from server");
};

// ✅ Add to Cart
export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async (cartData, { rejectWithValue }) => {
    try {
      const response = await api.post("/client/cart/add", cartData);

      // ✅ Check response, return message from backend
      if (response.status === 200 && response.data?.status) {
        return response.data;
      }

      return rejectWithValue(response.data?.message || "Something went wrong.");
    } catch (error) {
      console.error("Add to Cart Error:", error);

      // ✅ Ensure the exact error message from the API is returned
      return rejectWithValue(
        error.response?.data?.message || "Failed to add to cart"
      );
    }
  }
);

// ✅ Cart Slice
const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
    isLoading: false,
    error: null,
  },
  reducers: {
    clearCart: (state) => {
      state.items = [];
    },
    removeCartItem: (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addToCart.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.isLoading = false;
        const newItem = action.payload.data;

        // Check if item already exists, update quantity
        const existingIndex = state.items.findIndex(
          (item) => item.menu_item_id === newItem.menu_item_id
        );
        if (existingIndex !== -1) {
          state.items[existingIndex].quantity += newItem.quantity;
        } else {
          state.items.push(newItem);
        }
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.isLoading = false;

        // ✅ Store the exact error message from API in Redux state
        state.error = action.payload;
      });
  },
});

export const { clearCart, removeCartItem } = cartSlice.actions;
export default cartSlice.reducer;
