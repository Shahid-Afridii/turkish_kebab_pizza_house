import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api"; // ✅ Ensure API service is correctly imported

// ✅ Fetch Privacy Policy with Dynamic Policy Type
export const fetchPrivacyPolicy = createAsyncThunk(
  "policy/fetchPrivacyPolicy",
  async (policyType, { rejectWithValue }) => { // ✅ Accept policyType as an argument
    try {
      const response = await api.post("/client/policy", { policy: policyType });

      if ((response.status === 200 || response.status === 201) && response.data?.status) {
        return response.data.data; // ✅ Return full `data`, not just `privacy_policy`
      }

      throw new Error(response.data?.message || "Failed to fetch policy");
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Error fetching policy");
    }
  }
);

// ✅ Policy Slice
const policySlice = createSlice({
  name: "policy",
  initialState: {
    policyDetails: null, // ✅ Store full response data
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPrivacyPolicy.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPrivacyPolicy.fulfilled, (state, action) => {
        state.isLoading = false;
        state.policyDetails = action.payload; // ✅ Store full response data
        state.error = null;
      })
      .addCase(fetchPrivacyPolicy.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export default policySlice.reducer;
