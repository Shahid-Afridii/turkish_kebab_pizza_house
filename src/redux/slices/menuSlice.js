import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api"; // ✅ Centralized API import

// ✅ Fetch menu categories
export const fetchMenuData = createAsyncThunk("menu/fetchMenu", async () => {
  try {
    const response = await api.get("/menu/menu");
    return response.data.status ? response.data.data : [];
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

  console.log("Fetching menu items for categoryId:", categoryId, "VegOnly:", foodType);

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
    selectedCategoryId: null, // ✅ Track the selected category ID globally
    vegOnly: false, // ✅ Store vegOnly toggle in Redux
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
        state.menu = action.payload;
        if (!state.selectedCategoryId && action.payload.length > 0) {
          const firstActiveCategory = action.payload.find((category) => category.status === "active");
        
          if (firstActiveCategory) {
            state.selectedCategoryId = firstActiveCategory.id; // ✅ Auto-select first active category
          } else {
            state.selectedCategoryId = action.payload[0].id; // ✅ Fallback to first category if no active category exists
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
