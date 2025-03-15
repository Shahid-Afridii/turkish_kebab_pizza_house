import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api, { setAuthToken } from "../../services/api";


const validateResponse = (response) => {
  if (response.status === 200 || response.status === 201) {
    return response.data;
  }

  localStorage.removeItem("authToken");
  setAuthToken(null);

  if (dispatch) {
    dispatch(logout()); // ✅ Now, `logout` is dispatched properly
  }

  window.location.reload(); // Reload page to reflect logout state

  throw new Error(response.data?.message || "Unexpected response from server");
};



// ✅ Sign Up
export const signup = createAsyncThunk("auth/signup", async (userData, { dispatch,rejectWithValue }) => {
  try {
    const response = await api.post("/client/user/signup", userData);
    return validateResponse(response,dispatch);
  } catch (error) {
    localStorage.removeItem("authToken");

    console.error("Signup Error:", error);
    return rejectWithValue(error.response?.data?.message || "Signup failed");
  }
});

// ✅ Sign Up OTP Verification (Stores Token)
export const signupVerify = createAsyncThunk("auth/signupVerify", async (otpData, { dispatch,rejectWithValue }) => {
  try {
    const response = await api.post("/client/user/signup_verify", otpData);
    const data = validateResponse(response,dispatch);

    if (data.data) {
      localStorage.setItem("authToken", data.data);
      setAuthToken(data.data);
      startAutoLogout(); // Start auto-logout timer
    }

    return data;
  } catch (error) {
    localStorage.removeItem("authToken");

    console.error("Signup OTP Verification Error:", error);
    return rejectWithValue(error.response?.data?.message || "Invalid OTP");
  }
});

// ✅ Login (Generate OTP)
export const login = createAsyncThunk("auth/login", async (loginData, { dispatch,rejectWithValue }) => {
  try {
    const response = await api.post("/client/user/login", loginData);
    return validateResponse(response,dispatch);
  } catch (error) {
    localStorage.removeItem("authToken");

    console.error("Login Error:", error);
    return rejectWithValue(error.response?.data?.message || "Login failed");
  }
});

// ✅ Verify OTP for Login (Stores Token)
export const verifyOtp = createAsyncThunk("auth/verifyOtp", async (otpData, { dispatch,rejectWithValue }) => {
  try {
    const response = await api.post("/client/user/verify_otp", otpData);
    const data = validateResponse(response,dispatch);

    if (data.data) {
      localStorage.setItem("authToken", data.data);
      setAuthToken(data.data);
      startAutoLogout(); // Start auto-logout timer
    }

    return data;
  } catch (error) {
    localStorage.removeItem("authToken");

    console.error("OTP Verification Error:", error);
    return rejectWithValue(error.response?.data?.message || "Invalid OTP");
  }
});

// ✅ Fetch User Profile
export const getProfile = createAsyncThunk("auth/getProfile", async (_, { dispatch,rejectWithValue }) => {
  try {
    const response = await api.get("/client/user/get_profile");
    const data = validateResponse(response,dispatch);
    return data.data;
  } catch (error) {
    localStorage.removeItem("authToken");

    return rejectWithValue(error.response?.data?.message || "Failed to fetch profile");
  }
});

// ✅ Auto Logout Timer Function
const AUTO_LOGOUT_TIME = 24 * 60 * 60 * 1000; // 24 hours (1 day)

const startAutoLogout = () => {
  setTimeout(() => {
    localStorage.removeItem("authToken");
    setAuthToken(null);
    window.location.reload(); // Reload page to reflect logout state
  }, AUTO_LOGOUT_TIME);
};

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
      .addCase(signupVerify.fulfilled, (state, action) => {
        state.isLoading = false;
        state.token = action.payload.data;
        state.isAuthenticated = !!action.payload.data; 
      })
      .addCase(signupVerify.rejected, (state, action) => { state.isLoading = false; state.error = action.payload; })

      .addCase(login.pending, (state) => { state.isLoading = true; })
      .addCase(login.fulfilled, (state) => { state.isLoading = false; })
      .addCase(login.rejected, (state, action) => { state.isLoading = false; state.error = action.payload; })

      .addCase(verifyOtp.pending, (state) => { state.isLoading = true; })
      .addCase(verifyOtp.fulfilled, (state, action) => {
        state.isLoading = false;
        state.token = action.payload.data;
        state.isAuthenticated = !!action.payload.data; 
      })
      .addCase(verifyOtp.rejected, (state, action) => { state.isLoading = false; state.error = action.payload; })

      .addCase(getProfile.pending, (state) => { state.isLoading = true; })
      .addCase(getProfile.fulfilled, (state, action) => { state.isLoading = false; state.user = action.payload; })
      .addCase(getProfile.rejected, (state, action) => { 
        state.isLoading = false;
        state.error = action.payload;
        state.isAuthenticated = false; 
      });  },
});

// ✅ Export Actions & Reducer
export const { logout } = authSlice.actions;
export default authSlice.reducer;
