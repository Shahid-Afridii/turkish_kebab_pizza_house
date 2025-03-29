import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api"; // Ensure this points to your API service

// ✅ Fetch Addresses
export const getAddresses = createAsyncThunk(
  "userAddress/get",
  async (_, { rejectWithValue, getState }) => {
    const state = getState();
    const token = state.auth.token; // Get the token from the state

    // Check if token exists and is valid
    if (!token) {
      return rejectWithValue("No token found, please log in first.");
    }

    try {
      const response = await api.get("/client/address/get");

      // Check if the response is successful
      if ((response.status === 200 || response.status === 201) && response.data?.status) {
        return response.data.data; // Return address data
      }

      // If the response is not successful
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
// ✅ Update Address & Refresh List
export const updateAddress = createAsyncThunk(
  "userAddress/update",
  async (updatedData, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.post("/client/address/update", updatedData);
      if ((response.status === 200 || response.status === 201) && response.data?.status) {
        await dispatch(getAddresses()); // Refresh addresses after updating
        return updatedData;
      }
      throw new Error(response.data?.message || "Failed to update address");
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Error updating address");
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

// ✅ Set Primary Address & Refresh List
export const setPrimaryAddress = createAsyncThunk(
  "userAddress/setPrimary",
  async ({ id, is_primary = true }, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.post("/client/address/set_primary", { id, is_primary });

      if ((response.status === 200 || response.status === 201) && response.data?.status) {
        await dispatch(getAddresses()); // Refresh addresses after setting primary
        return { id, is_primary };
      }
      throw new Error(response.data?.message || "Failed to set primary address");
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Error setting primary address");
    }
  }
);

// ✅ User Address Slice
const userAddressSlice = createSlice({
  name: "userAddress",
  initialState: {
    addresses: [],
    selectedAddressId: null, // Store first address ID dynamically
    isLoading: false,
    error: null,
  },
  reducers: {
    setSelectedAddressId: (state, action) => {
      state.selectedAddressId = action.payload;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(getAddresses.pending, (state) => { state.isLoading = true; })
      .addCase(getAddresses.fulfilled, (state, action) => {
        state.isLoading = false;
        state.addresses = action.payload;
        state.selectedAddressId = action.payload.length > 0 ? action.payload[0].address_id : null;

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
      .addCase(updateAddress.pending, (state) => { state.isLoading = true; })
      .addCase(updateAddress.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(updateAddress.rejected, (state, action) => {
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
      })
      .addCase(setPrimaryAddress.pending, (state) => { state.isLoading = true; })
      .addCase(setPrimaryAddress.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        state.selectedAddressId = action.payload.id; 
      })
      .addCase(setPrimaryAddress.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});
export const { setSelectedAddressId } = userAddressSlice.actions;
export default userAddressSlice.reducer;
