import { combineReducers } from '@reduxjs/toolkit';
import cartReducer from './cartSlice';
import productReducer from './productSlice';
import sizeReducer from './sizeSlice';
import userReducer from "./userSlice"
import wishlistReducer from "./wishlistSlice"
import authReducer from './authSlice'
import dashboardReducer from "../../features/dashboard/dashboardSlice";
import darkModeReducer from "../../features/darkMode/darkModeSlice";
const rootReducer = combineReducers({
  cart: cartReducer,
  product: productReducer,
  productSize: sizeReducer,
  user: userReducer,
  wishlist: wishlistReducer,
  auth: authReducer,
  dashboard: dashboardReducer,
  darkMode: darkModeReducer,
});

export default rootReducer;