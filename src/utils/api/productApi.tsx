import axios from 'axios';
import { variables } from './variables';

const API_URL = variables.PRODUCT_API;

interface ProductSize {
  size: string;
  price: number;
  quantity: number;
}
// Định nghĩa kiểu dữ liệu cho Product (tùy chỉnh theo cấu trúc của bạn)
interface Product {
  productID: string;
  name: string;
  imageURL: string;
  brand: string;
  productSizes: ProductSize[];
}

// Lấy danh sách sản phẩm
const getProducts = async (): Promise<Product[]> => {
  const response = await axios.get<Product[]>(API_URL);
  return response.data;
};

// Lấy chi tiết sản phẩm theo nameAlias
const getProduct = async (nameAlias: string): Promise<Product> => {
  const response = await axios.get<Product>(`${API_URL}/ProductDetail/${nameAlias}`);
  return response.data;
};

// Thêm mới sản phẩm
const addProduct = async (product: Omit<Product, 'id'>): Promise<Product> => {
  const response = await axios.post<Product>(API_URL, product);
  return response.data;
};

// Cập nhật sản phẩm theo productId
const updateProduct = async (productId: number, product: Partial<Product>): Promise<Product> => {
  const response = await axios.put<Product>(`${API_URL}/${productId}`, product);
  return response.data;
};

// Xóa sản phẩm theo productId
const deleteProduct = async (productId: number): Promise<void> => {
  await axios.delete(`${API_URL}/${productId}`);
};

export default {
  getProducts,
  getProduct,
  addProduct,
  updateProduct,
  deleteProduct,
};
