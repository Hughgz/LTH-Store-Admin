import { createAsyncThunk } from "@reduxjs/toolkit";
import revenueApi from "../../utils/api/revenueApi";

export const fetchAllRevenue = createAsyncThunk(
  "revenue/fetchAll",
  async () => {
    return await revenueApi.fetchAll();
  }
);

export const fetchRevenueByPeriod = createAsyncThunk(
  "revenue/fetchByPeriod",
  async (params: { fromDate: string; toDate: string }) => {
    return await revenueApi.fetchByPeriod(params);
  }
);
