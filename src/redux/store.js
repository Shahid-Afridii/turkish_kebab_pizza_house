import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './slices/cartSlice';
import userReducer from './slices/userSlice';
import menuReducer from "./slices/menuSlice";
export const store = configureStore({
  reducer: {
    cart: cartReducer,
    menu: menuReducer,
    user: userReducer,
  },
});
