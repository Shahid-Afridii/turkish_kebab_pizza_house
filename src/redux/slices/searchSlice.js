import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

// Search API
// redux/slices/searchSlice.js
export const searchItems = createAsyncThunk(
    "search/searchItems",
    async ({ keyword, vegOnly }, { rejectWithValue }) => {
      try {
        const response = await api.post("/client/search", { keyword, veg_only: vegOnly }); // 👈 pass both
        if (response.status === 200 && response.data?.status) {
          return response.data;
        }
        throw new Error(response.data?.message || "Search failed");
      } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Search failed");
      }
    }
  );
  

const searchSlice = createSlice({
  name: "search",
  initialState: {
    results: [],
    loading: false,
    keyword: "", 
    error: null,
  },
  reducers: {
    clearSearchResults: (state) => {
      state.results = [];
      state.keyword = "";
      state.error = null;
    },
    setSearchKeyword: (state, action) => {
        state.keyword = action.payload;
      },
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchItems.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchItems.fulfilled, (state, action) => {
        state.loading = false;
        state.results = action.payload.data || [];
      })
      .addCase(searchItems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearSearchResults,setSearchKeyword } = searchSlice.actions;

export default searchSlice.reducer;
