import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { fetchProducts } from '../actions/productActions';

interface Product {
  id: string;
  name: string;
  description: string;
  defaultPrice: number;
  sizes: string[];
}

interface ProductState {
  products: Product[];
  originalProducts: Product[] | null;
  loading: boolean;
  error: string | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  filter: {
    minPrice: number | null;
    maxPrice: number | null;
    sizes: string[];
  };
}

const initialState: ProductState = {
  products: [],
  originalProducts: null,
  loading: false,
  error: null,
  status: 'idle',
  filter: {
    minPrice: null,
    maxPrice: null,
    sizes: [],
  },
};

const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    filterProducts: (state, action: PayloadAction<{ minPrice: number | null, maxPrice: number | null, sizes: string[] }>) => {
      const { minPrice, maxPrice, sizes } = action.payload;
      state.products = state.products.filter(product => {
        const isInPriceRange =
          (minPrice === null || product.defaultPrice >= minPrice) &&
          (maxPrice === null || product.defaultPrice <= maxPrice);
        const hasSize = sizes.length === 0 || product.sizes.some(size => sizes.includes(size));
        return isInPriceRange && hasSize;
      });
    },
    searchProducts: (state, action: PayloadAction<string>) => {
      const query = action.payload.toLowerCase();
      const originalProducts = state.originalProducts || state.products;
      const filteredProducts = originalProducts.filter(product => {
        return (
          product.name.toLowerCase().includes(query) ||
          product.description.toLowerCase().includes(query)
        );
      });
      state.products = filteredProducts;
      state.originalProducts = originalProducts;
      if (query.length === 0) {
        state.products = originalProducts;
        state.originalProducts = null;
      }
    },
    setLoad: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = 'loading';
      })
      // .addCase(fetchProducts.fulfilled, (state, action: PayloadAction<Product[]>) => {
      //   state.status = 'succeeded';
      //   state.products = action.payload; // action.payload contains Product[]
      // })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message ?? 'An error occurred';
      });
  },
});

export const {
  filterProducts,
  searchProducts,
  setLoad,
  setError,
} = productSlice.actions;

export default productSlice.reducer;
