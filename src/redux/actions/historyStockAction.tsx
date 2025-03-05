import { createAsyncThunk } from "@reduxjs/toolkit";
import stockHistoryApi from "../../utils/api/historyStockApi";

export const fetchStockHistoryByProductSizeId = createAsyncThunk(
  "stockHistory/fetchByProductSizeId",
  async (productSizeId: number) => {
    return await stockHistoryApi.fetchByProductSizeId(productSizeId);
  }
);

export const fetchStockHistoryByProductSizeIdAndPeriod = createAsyncThunk(
  "stockHistory/fetchByProductSizeIdAndPeriod",
  async (params: { productSizeId?: number; startDate?: Date; endDate?: Date }) => {
    return await stockHistoryApi.fetchByProductSizeIdAndPeriod(
      params.productSizeId,
      params.startDate,
      params.endDate
    );
  }
);
