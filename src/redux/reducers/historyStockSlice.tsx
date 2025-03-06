import { createSlice } from "@reduxjs/toolkit";
import { fetchStockHistoryByProductSizeId, fetchStockHistoryByProductSizeIdAndPeriod } from "../actions/historyStockAction";

interface StockHistoryData {
  StockHistoryID: number;
  UpdatedDateTime: string;
  ProductSizeID: number;
  StockChange: number;
  Note?: string;
}

interface StockHistoryState {
  data: StockHistoryData[];
  filtered: StockHistoryData[];
  total: number;
  loading: boolean;
  error: string | null;
}

const initialState: StockHistoryState = {
  data: [],
  filtered: [],
  total: 0,
  loading: false,
  error: null,
};

const stockHistorySlice = createSlice({
  name: "historyStock",
  initialState,
  reducers: {
    processStockHistoryData: (state, action) => {
      const { data } = action.payload;

      if (!data.length) {
        state.filtered = [];
        state.total = 0;
        return;
      }

      const processed = data.sort(
        (a: { UpdatedDateTime: string | number | Date; }, b: { UpdatedDateTime: string | number | Date; }) => new Date(a.UpdatedDateTime).getTime() - new Date(b.UpdatedDateTime).getTime()
      );

      state.filtered = processed;
      state.total = processed.reduce((sum: any, item: { StockChange: any; }) => sum + item.StockChange, 0);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStockHistoryByProductSizeId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStockHistoryByProductSizeId.fulfilled, (state, action) => {
        state.data = action.payload;
        state.filtered = action.payload; 
        state.loading = false;
      })
      .addCase(fetchStockHistoryByProductSizeId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch stock history data";
      })
      .addCase(fetchStockHistoryByProductSizeIdAndPeriod.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStockHistoryByProductSizeIdAndPeriod.fulfilled, (state, action) => {
        state.data = action.payload;
        state.filtered = action.payload; 
        state.loading = false;
      })
      .addCase(fetchStockHistoryByProductSizeIdAndPeriod.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch stock history data";
      });
  },
});

export const { processStockHistoryData } = stockHistorySlice.actions;
export default stockHistorySlice.reducer;
