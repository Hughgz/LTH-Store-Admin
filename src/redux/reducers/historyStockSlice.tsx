import { createSlice } from "@reduxjs/toolkit";
import { fetchStockHistoryByProductSizeId, fetchStockHistoryByProductSizeIdAndPeriod } from "../actions/historyStockAction";

interface StockHistoryData {
  StockHistoryID: number;
  UpdatedDateTime: string;  // Dữ liệu này sẽ được lấy nguyên vẹn từ backend
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

      // Kiểm tra nếu không có dữ liệu, làm sạch filtered và total
      if (!data.length) {
        state.filtered = [];
        state.total = 0;
        return;
      }


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
        state.filtered = action.payload;  // Cập nhật filtered với dữ liệu trả về từ API
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
        state.filtered = action.payload;  // Cập nhật filtered với dữ liệu trả về từ API
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
