import { createAsyncThunk } from "@reduxjs/toolkit";
import productApi from "../../utils/api/productApi";

// Define your Product interface
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

// Fetch all products
export const fetchProducts = createAsyncThunk<Product[]>(
  "products/fetchProducts",
  async () => {
    return await productApi.getProducts();
  }
);

// Fetch a product by ID
export const fetchProductById = createAsyncThunk<Product, string>(
  "products/fetchProductById",
  async (productId) => {
    return await productApi.getProductById(productId);
  }
);

// Fetch product by name alias
export const fetchProductByNameAlias = createAsyncThunk<Product, string>(
  "products/fetchProductByNameAlias",
  async (nameAlias) => {
    return await productApi.getProductByNameAlias(nameAlias);
  }
);

// Add a new product
export const createProduct = createAsyncThunk<Product, Omit<Product, "id">>(
  "products/createProduct",
  async (product) => {
    return await productApi.addProduct(product);
  }
);

// Update an existing product
export const updateExistingProduct = createAsyncThunk<Product, { productId: string; product: Partial<Product> }>(
  "products/updateExistingProduct",
  async ({ productId, product }) => {
    return await productApi.updateProduct(productId, product);
  }
);

// Delete a product
export const deleteProduct = createAsyncThunk<void, string>(
  "products/deleteProduct",
  async (productId) => {
    await productApi.deleteProduct(productId);
  }
);
