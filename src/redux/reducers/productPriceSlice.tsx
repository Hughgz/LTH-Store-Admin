import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import productPriceApi, { ProductPrice, ProductPriceCreateDto } from "../../utils/api/productPriceApi";
import { AxiosError } from "axios";

// Định nghĩa state
interface ProductPriceState {
  productPrices: ProductPrice[];
  activeProductPrice: ProductPrice | null;
  pendingProductPrices: ProductPrice[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: ProductPriceState = {
  productPrices: [],
  activeProductPrice: null,
  pendingProductPrices: [],
  status: "idle",
  error: null,
};

// Async Thunk - Lấy ProductPrice Active theo ProductSizeId
export const fetchActiveProductPriceBySizeId = createAsyncThunk(
  "productPrices/fetchActiveProductPriceBySizeId",
  async (productSizeId: number, { rejectWithValue }) => {
    try {
      return await productPriceApi.getActiveProductPriceBySizeId(productSizeId);
    } catch (error) {
      const axiosError = error as AxiosError;
      return rejectWithValue(axiosError.response?.data || "Error fetching active product price");
    }
  }
);

// Async Thunk - Lấy tất cả ProductPrice theo ProductSizeId
export const fetchAllProductPricesBySizeId = createAsyncThunk(
  "productPrices/fetchAllProductPricesBySizeId",
  async (productSizeId: number, { rejectWithValue }) => {
    try {
      return await productPriceApi.getAllProductPricesBySizeId(productSizeId);
    } catch (error) {
      const axiosError = error as AxiosError;
      return rejectWithValue(axiosError.response?.data || "Error fetching all product prices");
    }
  }
);

// Async Thunk - Lấy tất cả ProductPrice chờ duyệt
export const fetchAllPendingProductPrices = createAsyncThunk(
  "productPrices/fetchAllPendingProductPrices",
  async (_, { rejectWithValue }) => {
    try {
      return await productPriceApi.getAllPendingProductPrices();
    } catch (error) {
      const axiosError = error as AxiosError;
      return rejectWithValue(axiosError.response?.data || "Error fetching pending product prices");
    }
  }
);

// Async Thunk - Tạo mới ProductPrice
export const createNewProductPrice = createAsyncThunk(
  "productPrices/createNewProductPrice",
  async (productPriceDto: ProductPriceCreateDto, { rejectWithValue }) => {
    try {
      await productPriceApi.createProductPrice(productPriceDto);
    } catch (error) {
      const axiosError = error as AxiosError;
      return rejectWithValue(axiosError.response?.data || "Error creating ProductPrice");
    }
  }
);

// Async Thunk - Duyệt ProductPrice
export const approveProductPrice = createAsyncThunk(
  "productPrices/approveProductPrice",
  async (productPriceId: number, { rejectWithValue }) => {
    try {
      await productPriceApi.approveProductPrice(productPriceId);
    } catch (error) {
      const axiosError = error as AxiosError;
      return rejectWithValue(axiosError.response?.data || "Error approving ProductPrice");
    }
  }
);

// Redux Slice
const productPriceSlice = createSlice({
  name: "productPrices",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchActiveProductPriceBySizeId.fulfilled, (state, action: PayloadAction<ProductPrice>) => {
        state.activeProductPrice = action.payload;
      })

      .addCase(fetchAllProductPricesBySizeId.fulfilled, (state, action: PayloadAction<ProductPrice[]>) => {
        state.productPrices = action.payload;
      })

      .addCase(fetchAllPendingProductPrices.fulfilled, (state, action: PayloadAction<ProductPrice[]>) => {
        state.pendingProductPrices = action.payload;
      })

      .addCase(createNewProductPrice.rejected, (state, action) => {
        state.error = typeof action.payload === "string" ? action.payload : "Unknown error occurred";
      })

      .addCase(approveProductPrice.rejected, (state, action) => {
        state.error = typeof action.payload === "string" ? action.payload : "Unknown error occurred";
      });
  },
});

export default productPriceSlice.reducer;
