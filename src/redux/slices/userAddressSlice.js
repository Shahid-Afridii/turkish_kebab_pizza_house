import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api"; // Ensure this points to your API service

// ✅ Add Address
export const addAddress = createAsyncThunk(
  "userAddress/add",
  async (addressData, { rejectWithValue }) => {
    try {
      const response = await api.post("/client/address/add", addressData);
      if (response.status === 200 && response.data?.status) {
        return response.data.data; // Return the new address
      }
      throw new Error(response.data?.message || "Failed to add address");
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Error adding address");
    }
  }
);

// ✅ Fetch Addresses
export const getAddresses = createAsyncThunk("userAddress/get", async (_, { rejectWithValue }) => {
  try {
    const response = await api.get("/client/address/get");
    if (response.status === 200 && response.data?.status) {
      return response.data.data;
    }
    throw new Error(response.data?.message || "Failed to fetch addresses");
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Error fetching addresses");
  }
});

// ✅ Delete Address
export const deleteAddress = createAsyncThunk("userAddress/delete", async (addressId, { rejectWithValue }) => {
  try {
    const response = await api.post("/client/address/delete", { id: addressId });
    if (response.status === 200 && response.data?.status) {
      return addressId; // Return ID to remove from store
    }
    throw new Error(response.data?.message || "Failed to delete address");
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Error deleting address");
  }
});

// ✅ User Address Slice
const userAddressSlice = createSlice({
  name: "userAddress",
  initialState: {
    addresses: [],
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAddresses.pending, (state) => { state.isLoading = true; })
      .addCase(getAddresses.fulfilled, (state, action) => {
        state.isLoading = false;
        state.addresses = action.payload;
      })
      .addCase(getAddresses.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      .addCase(addAddress.pending, (state) => { state.isLoading = true; })
      .addCase(addAddress.fulfilled, (state, action) => {
        state.isLoading = false;
        state.addresses.push(action.payload); // Add new address
      })
      .addCase(addAddress.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      .addCase(deleteAddress.pending, (state) => { state.isLoading = true; })
      .addCase(deleteAddress.fulfilled, (state, action) => {
        state.isLoading = false;
        state.addresses = state.addresses.filter(addr => addr.id !== action.payload);
      })
      .addCase(deleteAddress.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export default userAddressSlice.reducer;
