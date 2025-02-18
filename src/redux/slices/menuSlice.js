import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api"; // ✅ Import API from centralized API file

// ✅ Fetch menu categories
export const fetchMenuData = createAsyncThunk("menu/fetchMenu", async () => {
  try {
    const response = await api.get("/menu/menu"); // ✅ Fetch data from API
    return response.data.status ? response.data.data : [];
  } catch (error) {
    console.error("Error fetching menu:", error);
    throw error;
  }
});

// ✅ Fetch menu items dynamically
export const fetchMenuItems = createAsyncThunk("menu/fetchMenuItems", async () => {
  try {
    const response = await api.post("/menu/menu_item", {
      id: 1,
      food_type: true,
    });
    return response.data.status ? response.data.data : [];
  } catch (error) {
    console.error("Error fetching menu items:", error);
    throw error;
  }
});

const menuSlice = createSlice({
  name: "menu",
  initialState: {
    menu: [],
    menuItems: [], // ✅ Added missing menuItems state
    status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null, // ✅ Added missing error state
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // ✅ Handling menu categories
      .addCase(fetchMenuData.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchMenuData.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.menu = action.payload;
      })
      .addCase(fetchMenuData.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })

      // ✅ Handling menu items
      .addCase(fetchMenuItems.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchMenuItems.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.menuItems = action.payload;
      })
      .addCase(fetchMenuItems.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      }); // ✅ Removed extra period
  },
});

export default menuSlice.reducer;
