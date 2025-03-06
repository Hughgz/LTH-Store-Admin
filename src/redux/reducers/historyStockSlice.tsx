import { createSlice } from "@reduxjs/toolkit";
import { fetchStockHistoryByProductSizeId, fetchStockHistoryByPeriod } from "../actions/historyStockAction";

interface StockHistoryData {
  StockHistoryID: number;
  UpdatedDateTime: string;
  ProductSizeID: number;
  StockChange: number;
  Note?: string;
}

interface StockHistoryState {
  data: StockHistoryData[];
  loading: boolean;
  error: string | null;
}

const initialState: StockHistoryState = {
  data: [],
  loading: false,
  error: null,
};

const stockHistorySlice = createSlice({
  name: "stockHistory",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchStockHistoryByProductSizeId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStockHistoryByProductSizeId.fulfilled, (state, action) => {
        state.data = action.payload;
        state.loading = false;
      })
      .addCase(fetchStockHistoryByProductSizeId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch stock history";
      })
      .addCase(fetchStockHistoryByPeriod.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStockHistoryByPeriod.fulfilled, (state, action) => {
        state.data = action.payload;
        state.loading = false;
      })
      .addCase(fetchStockHistoryByPeriod.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch stock history";
      });
  },
});

export default stockHistorySlice.reducer;
