import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { fetchProducts, fetchProductById, fetchProductByNameAlias } from '../actions/productActions';

interface Product {
  id: string;
  name: string;
  brand: string;
  description: string;
  imageURL: string;
  nameAlias: string;
  category: {
    id: string;
    name: string;
  };
  defaultPrice: number;
  sizes: number[];
  productSizes: {
    id: string;
    size: number;
    price: number;
    costPrice: number;
    quantity: number;
  }[];
}

interface ProductState {
  products: Product[];
  productDetail: Product | null;
  loading: boolean;
  error: string | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
}

const initialState: ProductState = {
  products: [],
  productDetail: null,
  loading: false,
  error: null,
  status: 'idle',
};

const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProducts.fulfilled, (state, action: PayloadAction<Product[]>) => {
        state.status = 'succeeded';
        state.products = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message ?? 'An error occurred';
      })
      .addCase(fetchProductById.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProductById.fulfilled, (state, action: PayloadAction<Product>) => {
        state.status = 'succeeded';
        state.productDetail = action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message ?? 'An error occurred';
      })
      .addCase(fetchProductByNameAlias.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProductByNameAlias.fulfilled, (state, action: PayloadAction<Product>) => {
        state.status = 'succeeded';
        state.productDetail = action.payload;
      })
      .addCase(fetchProductByNameAlias.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message ?? 'An error occurred';
      });
  },
});

export default productSlice.reducer;
