import axios from "axios";
import { variables } from "../api/variables"; // Chứa API_BASE_URL

const API_URL = `${variables.ProductPrice_API}`;

// Định nghĩa kiểu dữ liệu ProductPrice
export interface ProductPrice {
  id: number;
  createdAt: string;
  startDate: string | null;
  endDate: string | null;
  productSizeId: number;
  sellingPrice: number;
  productPriceStatus: number;
  description: string | null;
}

// Định nghĩa kiểu dữ liệu cho Create DTO
export interface ProductPriceCreateDto {
  startDate: string | null;
  endDate: string | null;
  productSizeId: number;
  sellingPrice: number;
  description: string | null;
}

// Lấy ProductPrice Active theo ProductSizeId
const getActiveProductPriceBySizeId = async (productSizeId: number): Promise<ProductPrice> => {
  const response = await axios.get<ProductPrice>(`${API_URL}/${productSizeId}`);
  return response.data;
};

// Lấy tất cả ProductPrice theo ProductSizeId
const getAllProductPricesBySizeId = async (productSizeId: number): Promise<ProductPrice[]> => {
  const response = await axios.get<ProductPrice[]>(`${API_URL}/all-product-price/${productSizeId}`);
  return response.data;
};

// Lấy tất cả ProductPrice chờ duyệt
const getAllPendingProductPrices = async (): Promise<ProductPrice[]> => {
  const response = await axios.get<ProductPrice[]>(`${API_URL}/all-product-price-pending-for-approval`);
  return response.data;
};

// Tạo mới một ProductPrice (mặc định PendingForApproval)
const createProductPrice = async (productPrice: ProductPriceCreateDto): Promise<void> => {
  await axios.post(`${API_URL}`, productPrice);
};

// Duyệt ProductPrice (chuyển trạng thái Active)
const approveProductPrice = async (productPriceId: number): Promise<void> => {
  await axios.post(`${API_URL}/approve/${productPriceId}`);
};

export default {
  getActiveProductPriceBySizeId,
  getAllProductPricesBySizeId,
  getAllPendingProductPrices,
  createProductPrice,
  approveProductPrice,
};
