import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './slices/cartSlice';
import userReducer from './slices/userSlice';
import menuReducer from "./slices/menuSlice";
import authReducer from "./slices/authSlice";
import shopReducer from "./slices/shopSlice";
import userAddressReducer from "./slices/userAddressSlice";
import orderReducer from "./slices/orderSlice"; // Import Order Slice


export const store = configureStore({
  reducer: {
    cart: cartReducer,
    menu: menuReducer,
    user: userReducer,
    auth: authReducer,
    shop: shopReducer,
    userAddress: userAddressReducer,
    order: orderReducer,


  },
});
