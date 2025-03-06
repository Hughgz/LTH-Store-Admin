import { createAsyncThunk } from "@reduxjs/toolkit";
import stockHistoryApi from "../../utils/api/historyStockApi";

export const fetchStockHistoryByProductSizeId = createAsyncThunk(
  "stockHistory/fetchByProductSizeId",
  async (productSizeId: number) => {
    return await stockHistoryApi.fetchByProductSizeId(productSizeId);
  }
);

export const fetchStockHistoryByPeriod = createAsyncThunk(
  "stockHistory/fetchByPeriod",
  async (params: { productSizeId: number; fromDate: string; toDate: string }) => {
    return await stockHistoryApi.fetchByPeriod(params);
  }
);
