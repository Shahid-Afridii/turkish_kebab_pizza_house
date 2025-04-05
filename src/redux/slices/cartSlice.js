import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

// ✅ Helper function to validate API response
const validateResponse = (response) => {
  if ((response.status === 200 || response.status === 201) && response.data?.status) {
    return response.data;
  }
  throw new Error(response.data?.message || "Unexpected response from server");
};

// ✅ Fetch Cart Items (GET Request)
export const getCart = createAsyncThunk(
  "cart/getCart",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/client/cart/get");
      return validateResponse(response);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch cart");
    }
  }
);

// ✅ Add to Cart (POST Request)
export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async (cartData, { dispatch, rejectWithValue }) => {
    try {
      const response = await api.post("/client/cart/add", cartData);
      const data = validateResponse(response);

      // ✅ Ensure latest cart is fetched
      await dispatch(getCart()).unwrap();
      dispatch(setBottomBarVisible(true)); // ✅ Show BottomCartBar when item is added
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to add to cart");
    }
  }
);

// ✅ Remove Cart Item (DELETE Request)
export const removeCartItem = createAsyncThunk(
  "cart/removeCartItem",
  async (cartId, { dispatch, rejectWithValue }) => {
    try {
      const response = await api.post(`/client/cart/del`,
        { cart_id: cartId }, // ✅ Send cart_id in request body
      );

      validateResponse(response);

      // ✅ Fetch updated cart after deletion
      await dispatch(getCart()).unwrap();
      return cartId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to remove item");
    }
  }
);

// ✅ Update Quantity
// ✅ Update Quantity
export const updateQuantity = createAsyncThunk(
  "cart/updateQuantity",
  async ({ menu_item_id, quantity }, { dispatch, getState, rejectWithValue }) => {
    try {
      const item = getState().cart.items.find((i) => i.menu_item_id === menu_item_id);
      if (!item) return rejectWithValue("Item not found in cart");

      const updatedCartData = {
        menu_item_id,
        quantity,
        instructions: item.instructions || "",
        addons: item.add_ons?.map((addon) => ({
          addon_id: addon.id,
          addon_item_id: addon.items.map((addonItem) => addonItem.id) // Extracting the id from each item in the items array
        })) || []
      };

      await dispatch(addToCart(updatedCartData)).unwrap();
      return { menu_item_id, quantity };
    } catch (error) {
      return rejectWithValue(error?.message || "Failed to update quantity");
    }
  }
);


// ✅ Cart Slice
const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
    totalItems: 0,
    isLoading: false,
    error: null,
    cartFetched: false,
    isBottomBarVisible: false,
  },
  reducers: {
    clearCart: (state) => {
      state.items = [];
      state.totalItems = 0;
      state.cartFetched = false;
      state.isBottomBarVisible = false;
    },
    setBottomBarVisible: (state, action) => {
      state.isBottomBarVisible = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCart.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getCart.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload.data || [];
        state.totalAmount = action.payload.total_amount || 0; // ✅ Fix: Assign totalAmount
        state.taxableAmount = action.payload.taxable_amount || 0;
        state.taxAmount = action.payload.tax_amount || 0;
        state.totalItems = state.items.reduce((total, item) => total + (item.qty || 0), 0);
        state.cartFetched = true;
      })
    
      .addCase(getCart.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(addToCart.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addToCart.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(updateQuantity.fulfilled, (state, action) => {
        const { menu_item_id, quantity } = action.payload;
        const item = state.items.find((i) => i.menu_item_id === menu_item_id);
        if (item) {
          item.qty = quantity;
          state.totalItems = state.items.reduce((total, i) => total + (i.qty || 0), 0);
        }
      })
      .addCase(removeCartItem.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(removeCartItem.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = state.items.filter((item) => item.cart_id !== action.payload);
        state.totalItems = state.items.reduce((total, item) => total + (item.qty || 0), 0);
      })
      .addCase(removeCartItem.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCart, setBottomBarVisible } = cartSlice.actions;
export default cartSlice.reducer;
