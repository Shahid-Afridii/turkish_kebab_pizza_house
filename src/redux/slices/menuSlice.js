import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api"; // ✅ Centralized API import

// ✅ Fetch menu categories
export const fetchMenuData = createAsyncThunk("menu/fetchMenu", async () => {
  try {
    const response = await api.get("/menu/menu");
    if (response.data.status) {
      return {
        menu: response.data.data,
        holiday: response.data.holiday || false,
      };
    }
    return { menu: [], holiday: false };
  } catch (error) {
    console.error("Error fetching menu:", error);
    throw error;
  }
});

// ✅ Fetch menu items dynamically based on selected category & vegOnly filter
export const fetchMenuItems = createAsyncThunk("menu/fetchMenuItems", async (_, { getState }) => {
  const state = getState().menu;
  const categoryId = state.selectedCategoryId;
  const foodType = state.vegOnly ? true : false; // ✅ Pass vegOnly state



  try {
    const response = await api.post("/menu/menu_item", {
      id: categoryId, 
      food_type: foodType,
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
    menuItems: [],
    selectedCategoryId: null, 
    holiday: false, 
    vegOnly: false, 
    status: "idle",
    error: null,
  },
  reducers: {
    // ✅ Update selected category
    setSelectedCategoryId: (state, action) => {
      state.selectedCategoryId = action.payload;
    },

    // ✅ Toggle vegOnly and re-fetch menu items
    toggleVegOnly: (state) => {
      state.vegOnly = !state.vegOnly;
    },
  },
  extraReducers: (builder) => {
    builder
      // ✅ Handling menu categories
      .addCase(fetchMenuData.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchMenuData.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.menu = action.payload.menu;
        state.holiday = action.payload.holiday;
        if (!state.selectedCategoryId && action.payload.menu.length > 0) {
          const firstActiveCategory = action.payload.menu.find((category) => category.status === "active");
      
          if (firstActiveCategory) {
            state.selectedCategoryId = firstActiveCategory.id;
          } else {
            state.selectedCategoryId = action.payload.menu[0].id;
          }
        }
        
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
      });
  },
});

export const { setSelectedCategoryId, toggleVegOnly } = menuSlice.actions; // ✅ Export actions
export default menuSlice.reducer;
