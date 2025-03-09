import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api"; // Ensure this points to your API service

// ✅ Fetch Addresses
export const getAddresses = createAsyncThunk(
  "userAddress/get",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/client/address/get");
      if ((response.status === 200 || response.status === 201) && response.data?.status) {
        return response.data.data;
      }
      throw new Error(response.data?.message || "Failed to fetch addresses");
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Error fetching addresses");
    }
  }
);

// ✅ Add Address & Refresh List
export const addAddress = createAsyncThunk(
  "userAddress/add",
  async (addressData, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.post("/client/address/add", addressData);
      if ((response.status === 200 || response.status === 201) && response.data?.status) {
        await dispatch(getAddresses()); // Fetch updated addresses after adding
        return response.data.data;
      }
      throw new Error(response.data?.message || "Failed to add address");
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Error adding address");
    }
  }
);

// ✅ Delete Address & Refresh List
export const deleteAddress = createAsyncThunk(
  "userAddress/delete",
  async (addressId, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.post("/client/address/del", { address_id: addressId });

      if ((response.status === 200 || response.status === 201) && response.data?.status) {
        await dispatch(getAddresses()); // Refresh addresses after deletion
        return addressId;
      }
      throw new Error(response.data?.message || "Failed to delete address");
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Error deleting address");
    }
  }
);


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
      .addCase(addAddress.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
        // The addresses are updated by getAddresses
      })
      .addCase(addAddress.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      .addCase(deleteAddress.pending, (state) => { state.isLoading = true; })
      .addCase(deleteAddress.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
        // The addresses are updated by getAddresses
      })
      .addCase(deleteAddress.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export default userAddressSlice.reducer;
