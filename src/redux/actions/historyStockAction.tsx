import { createAsyncThunk } from "@reduxjs/toolkit";
import stockHistoryApi from "../../utils/api/historyStockApi";

export const fetchStockHistoryByProductSizeId = createAsyncThunk(
  "historyStock/fetchByProductSizeId",
  async (productSizeId: number) => {
    const data = await stockHistoryApi.fetchByProductSizeId(productSizeId);
    return data; 
  }
);

export const fetchStockHistoryByProductSizeIdAndPeriod = createAsyncThunk(
  "historyStock/fetchByProductSizeIdAndPeriod",
  async (params: { productSizeId?: number; startDate?: Date; endDate?: Date }) => {
    const data = await stockHistoryApi.fetchByProductSizeIdAndPeriod(
      params.productSizeId,
      params.startDate,
      params.endDate
    );
    return data;
  }
);
