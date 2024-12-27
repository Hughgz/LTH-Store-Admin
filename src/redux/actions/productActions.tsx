import { createAsyncThunk } from '@reduxjs/toolkit';
import productApi from '../../utils/api/productApi';

// Define the types for product and arguments
interface Product {
  productID: string;
  name: string;
  imageURL: string;
  brand: string;
  productSizes: ProductSize[];
}

interface ProductSize {
  size: string;
  price: number;
  quantity: number;
}

interface CreateProductArgs {
  product: Product;
}

interface UpdateProductArgs {
  productId: number;
  product: Product;
}

// Fetch all products
export const fetchProducts = createAsyncThunk<Product[]>(
  'products/fetchProducts',
  async () => {
    const products = await productApi.getProducts();
    return products;
  }
);

// Fetch a single product by ID
export const fetchProductById = createAsyncThunk<Product, string>(
  'products/fetchProductById',
  async (nameAlias) => {
    const product = await productApi.getProduct(nameAlias);
    return product;
  }
);

// Create a new product
export const createProduct = createAsyncThunk<Product, CreateProductArgs>(
  'products/createProduct',
  async ({ product }) => {
    const createdProduct = await productApi.addProduct(product);
    return createdProduct;
  }
);

// Update an existing product
export const updateExistingProduct = createAsyncThunk<Product, UpdateProductArgs>(
  'products/updateExistingProduct',
  async ({ productId, product }) => {
    const updatedProduct = await productApi.updateProduct(productId, product);
    return updatedProduct;
  }
);
