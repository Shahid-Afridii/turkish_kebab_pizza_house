import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

// ✅ Helper function to validate API response
const validateResponse = (response) => {
  if (response.status === 200 && response.data?.status) {
    return response.data;
  }
  throw new Error(response.data?.message || "Unexpected response from server");
};

// ✅ Add to Cart (API Call)
export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async (cartData, { rejectWithValue }) => {
    try {
      const response = await api.post("/client/cart/add", cartData);
      return validateResponse(response); // ✅ Using validateResponse
    } catch (error) {
      console.error("Add to Cart Error:", error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to add to cart"
      );
    }
  }
);

// ✅ Cart Slice (Handles everything locally for quantity update & removal)
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
    // ✅ Remove an item from the cart (Local state only, no API)
    removeFromCart: (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
    // ✅ Update item quantity (Local state only, no API)
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.items.find((item) => item.id === id);
      if (item) {
        item.quantity = quantity; // ✅ Update only in Redux state
      }
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
        state.error = action.payload;
      });
  },
});

export const { clearCart, removeFromCart, updateQuantity } = cartSlice.actions;
export default cartSlice.reducer;
