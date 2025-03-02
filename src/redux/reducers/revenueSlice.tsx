import { createSlice } from "@reduxjs/toolkit";
import { fetchAllRevenue, fetchRevenueByPeriod } from "../actions/revenueActions";

interface RevenueData {
  id: number;
  date: string;
  amount: number;
}

interface RevenueState {
  data: RevenueData[];
  filtered: RevenueData[];
  total: number;
  loading: boolean;
  error: string | null;
}

const initialState: RevenueState = {
  data: [],
  filtered: [],
  total: 0,
  loading: false,
  error: null,
};

const revenueSlice = createSlice({
  name: "revenue",
  initialState,
  reducers: {
    processRevenueData: (state, action) => {
      const { data, filterType } = action.payload;

      if (!data.length) {
        state.filtered = [];
        state.total = 0;
        return;
      }

      const processor =
        filterType === "month"
          ? (d: RevenueData[]) =>
              Object.entries(
                d.reduce<Record<string, number>>((acc, item) => {
                  const key = new Date(item.date).toISOString().slice(0, 7);
                  acc[key] = (acc[key] || 0) + item.amount;
                  return acc;
                }, {})
              ).map(([date, amount]) => ({ id: 0, date, amount }))
          : (d: RevenueData[]) =>
              d.map((item) => ({
                ...item,
                date: new Date(item.date).toISOString().split("T")[0],
              }));

      const processed = processor(data).sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      );

      state.filtered = processed;
      state.total = processed.reduce((sum, item) => sum + item.amount, 0);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllRevenue.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllRevenue.fulfilled, (state, action) => {
        state.data = action.payload;
        state.loading = false;
      })
      .addCase(fetchAllRevenue.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch revenue data";
      })
      .addCase(fetchRevenueByPeriod.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRevenueByPeriod.fulfilled, (state, action) => {
        state.data = action.payload;
        state.loading = false;
      })
      .addCase(fetchRevenueByPeriod.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch revenue data";
      });
  },
});

export const { processRevenueData } = revenueSlice.actions;
export default revenueSlice.reducer;
