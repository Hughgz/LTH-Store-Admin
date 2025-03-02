import axios from 'axios';
import { variables } from './variables';

const API_URL = variables.PRODUCT_API;

interface ProductSize {
  id: string;
  size: number;
  price: number;
  costPrice: number;
  quantity: number;
}

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
  productSizes: ProductSize[];
}

// Lấy danh sách sản phẩm
const getProducts = async (): Promise<Product[]> => {
  const response = await axios.get<Product[]>(API_URL);
  return response.data;
};

// Lấy chi tiết sản phẩm theo productID
const getProductById = async (productId: string): Promise<Product> => {
  const response = await axios.get<Product>(`${API_URL}/${productId}`);
  return response.data;
};

// Lấy chi tiết sản phẩm theo nameAlias
const getProductByNameAlias = async (nameAlias: string): Promise<Product> => {
  const response = await axios.get<Product>(`${API_URL}/ProductDetail/${nameAlias}`);
  return response.data;
};

// Thêm mới sản phẩm
const addProduct = async (product: Omit<Product, 'id'>): Promise<Product> => {
  const response = await axios.post<Product>(API_URL, product);
  return response.data;
};

// Cập nhật sản phẩm theo productId
const updateProduct = async (productId: string, product: Partial<Product>): Promise<Product> => {
  const response = await axios.put<Product>(`${API_URL}/${productId}`, product);
  return response.data;
};

// Xóa sản phẩm theo productId
const deleteProduct = async (productId: string): Promise<void> => {
  await axios.delete(`${API_URL}/${productId}`);
};

export default {
  getProducts,
  getProductById,
  getProductByNameAlias,
  addProduct,
  updateProduct,
  deleteProduct,
};
