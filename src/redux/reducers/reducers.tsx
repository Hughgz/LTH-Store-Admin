import { combineReducers } from '@reduxjs/toolkit';
import productReducer from './productSlice';
import userReducer from "./userSlice"
import authReducer from './authSlice'
import dashboardReducer from "../../features/dashboard/dashboardSlice";
import darkModeReducer from "../../features/darkMode/darkModeSlice";
import revenueReducer from "./revenueSlice"
import historyStockReduce from "./historyStockSlice"
const rootReducer = combineReducers({
  product: productReducer,
  user: userReducer,
  auth: authReducer,
  dashboard: dashboardReducer,
  darkMode: darkModeReducer,
  revenue: revenueReducer,
  historyStock: historyStockReduce,
});

export default rootReducer;