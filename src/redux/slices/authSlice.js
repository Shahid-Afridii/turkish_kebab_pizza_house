import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api, { setAuthToken } from "../../services/api";

// ✅ Helper function to validate API response
const validateResponse = (response) => {
  if (response.status === 200 && response.data?.status) {
    return response.data;
  }
  throw new Error(response.data?.message || "Unexpected response from server");
};

// ✅ Sign Up
export const signup = createAsyncThunk("auth/signup", async (userData, { rejectWithValue }) => {
  try {
    const response = await api.post("/client/user/signup", userData);
    return validateResponse(response);
  } catch (error) {
    console.error("Signup Error:", error);
    return rejectWithValue(error.response?.data?.message || "Signup failed");
  }
});

// ✅ Sign Up OTP Verification (Stores Token)
export const signupVerify = createAsyncThunk("auth/signupVerify", async (otpData, { rejectWithValue }) => {
  try {
    const response = await api.post("/client/user/signup_verify", otpData);
    const data = validateResponse(response);

    if (data.data) {
      localStorage.setItem("authToken", data.data);
      setAuthToken(data.data);
    }

    return data;
  } catch (error) {
    console.error("Signup OTP Verification Error:", error);
    return rejectWithValue(error.response?.data?.message || "Invalid OTP");
  }
});

// ✅ Login (Generate OTP)
export const login = createAsyncThunk("auth/login", async (loginData, { rejectWithValue }) => {
  try {
    const response = await api.post("/client/user/login", loginData);
    return validateResponse(response);
  } catch (error) {
    console.error("Login Error:", error);
    return rejectWithValue(error.response?.data?.message || "Login failed");
  }
});

// ✅ Verify OTP for Login (Stores Token)
export const verifyOtp = createAsyncThunk("auth/verifyOtp", async (otpData, { rejectWithValue }) => {
  try {
    const response = await api.post("/client/user/verify_otp", otpData);
    const data = validateResponse(response);

    if (data.data) {
      localStorage.setItem("authToken", data.data);
      setAuthToken(data.data);
    }

    return data;
  } catch (error) {
    console.error("OTP Verification Error:", error);
    return rejectWithValue(error.response?.data?.message || "Invalid OTP");
  }
});

// ✅ Fetch User Profile
export const getProfile = createAsyncThunk("auth/getProfile", async (_, { rejectWithValue }) => {
  try {
    const response = await api.get("/client/user/get_profile");
    return validateResponse(response);
  } catch (error) {
    console.error("Get Profile Error:", error);
    return rejectWithValue(error.response?.data?.message || "Failed to fetch profile");
  }
});

// ✅ Authentication Slice
const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    token: localStorage.getItem("authToken") || null,
    isLoading: false,
    error: null,
    isAuthenticated: !!localStorage.getItem("authToken"),
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      localStorage.removeItem("authToken");
      setAuthToken(null);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signup.pending, (state) => { state.isLoading = true; })
      .addCase(signup.fulfilled, (state, action) => { state.isLoading = false; state.user = action.payload; })
      .addCase(signup.rejected, (state, action) => { state.isLoading = false; state.error = action.payload; })

      .addCase(signupVerify.pending, (state) => { state.isLoading = true; })
      .addCase(signupVerify.fulfilled, (state, action) => { state.isLoading = false; state.token = action.payload.data; state.isAuthenticated = true; })
      .addCase(signupVerify.rejected, (state, action) => { state.isLoading = false; state.error = action.payload; })

      .addCase(login.pending, (state) => { state.isLoading = true; })
      .addCase(login.fulfilled, (state) => { state.isLoading = false; })
      .addCase(login.rejected, (state, action) => { state.isLoading = false; state.error = action.payload; })

      .addCase(verifyOtp.pending, (state) => { state.isLoading = true; })
      .addCase(verifyOtp.fulfilled, (state, action) => { state.isLoading = false; state.token = action.payload.data; state.isAuthenticated = true; })
      .addCase(verifyOtp.rejected, (state, action) => { state.isLoading = false; state.error = action.payload; })

      .addCase(getProfile.pending, (state) => { state.isLoading = true; })
      .addCase(getProfile.fulfilled, (state, action) => { state.isLoading = false; state.user = action.payload; })
      .addCase(getProfile.rejected, (state, action) => { state.isLoading = false; state.error = action.payload; });
  },
});

// ✅ Export Actions & Reducer
export const { logout } = authSlice.actions;
export default authSlice.reducer;
