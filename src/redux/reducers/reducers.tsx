import { combineReducers } from '@reduxjs/toolkit';
import productReducer from './productSlice';
import userReducer from "./userSlice"
import authReducer from './authSlice'
import dashboardReducer from "../../features/dashboard/dashboardSlice";
import darkModeReducer from "../../features/darkMode/darkModeSlice";
import revenueReducer from "./revenueSlice";
import historyStockReducer from "./historyStockSlice";
import orderReducer from "./orderSlice";
import productPriceReducer from "./productPriceSlice";
import productSizeReducer from "./productSizeSlice";

const rootReducer = combineReducers({
  product: productReducer,
  user: userReducer,
  auth: authReducer,
  dashboard: dashboardReducer,
  darkMode: darkModeReducer,
  revenue: revenueReducer,
  historyStock: historyStockReducer,
  order: orderReducer,
  productPrices: productPriceReducer,
  productSize: productSizeReducer,
});

export default rootReducer;