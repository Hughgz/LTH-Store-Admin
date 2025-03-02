import { createSlice } from "@reduxjs/toolkit";
import { getByIdProductSize, getAllProductSizes } from "../actions/productSizeAction";

interface ProductSizeState {
  productSize: any | null;
  productSizes: any[];
  loading: boolean;
  error: string | null;
}

const initialState: ProductSizeState = {
  productSize: null,
  productSizes: [],
  loading: false,
  error: null,
};

const productSizeSlice = createSlice({
  name: "productSize",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // 🟢 Lấy ProductSize theo ID
    builder
      .addCase(getByIdProductSize.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getByIdProductSize.fulfilled, (state, action) => {
        state.loading = false;
        state.productSize = action.payload;
      })
      .addCase(getByIdProductSize.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // 🔵 Lấy danh sách tất cả ProductSize
    builder
      .addCase(getAllProductSizes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllProductSizes.fulfilled, (state, action) => {
        state.loading = false;
        state.productSizes = action.payload;
      })
      .addCase(getAllProductSizes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default productSizeSlice.reducer;
