import { createAsyncThunk } from '@reduxjs/toolkit';
import productApi from '../../utils/api/productApi';

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

// Lấy tất cả sản phẩm
export const fetchProducts = createAsyncThunk<Product[]>(
  'products/fetchProducts',
  async () => {
    return await productApi.getProducts();
  }
);

// Lấy sản phẩm theo productID
export const fetchProductById = createAsyncThunk<Product, string>(
  'products/fetchProductById',
  async (productId) => {
    return await productApi.getProductById(productId);
  }
);

// Lấy sản phẩm theo nameAlias
export const fetchProductByNameAlias = createAsyncThunk<Product, string>(
  'products/fetchProductByNameAlias',
  async (nameAlias) => {
    return await productApi.getProductByNameAlias(nameAlias);
  }
);

// Thêm sản phẩm mới
export const createProduct = createAsyncThunk<Product, Omit<Product, 'id'>>(
  'products/createProduct',
  async (product) => {
    return await productApi.addProduct(product);
  }
);

// Cập nhật sản phẩm
export const updateExistingProduct = createAsyncThunk<Product, { productId: string; product: Partial<Product> }>(
  'products/updateExistingProduct',
  async ({ productId, product }) => {
    return await productApi.updateProduct(productId, product);
  }
);

// Xóa sản phẩm
export const deleteProduct = createAsyncThunk<void, string>(
  'products/deleteProduct',
  async (productId) => {
    await productApi.deleteProduct(productId);
  }
);
