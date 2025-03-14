import axios from "axios";
import { variables } from "../api/variables"; // Giả sử bạn có API_BASE_URL ở đây

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
  startDate: string;
  endDate: string;
  productSizeId: number;
  sellingPrice: number;
  description: string;
}

const createNewProductPrice = async (productPrice: ProductPriceCreateDto) => {
  try {
    const response = await axios.post(`${API_URL}`, productPrice, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      console.error("API Error Response:", error.response.data);  // Log phản hồi lỗi chi tiết từ API
    } else {
      console.error("Unexpected error:", error);
    }
    throw error;
  }
};


// Các hàm còn lại (không thay đổi)
const getActiveProductPriceBySizeId = async (productSizeId: number): Promise<ProductPrice> => {
  const response = await axios.get<ProductPrice>(`${API_URL}/${productSizeId}`);
  return response.data;
};

const getAllProductPricesBySizeId = async (productSizeId: number): Promise<ProductPrice[]> => {
  const response = await axios.get<ProductPrice[]>(`${API_URL}/all-product-price/${productSizeId}`);
  return response.data;
};

const getAllPendingProductPrices = async (): Promise<ProductPrice[]> => {
  const response = await axios.get<ProductPrice[]>(`${API_URL}/all-product-price-pending-for-approval`);
  return response.data;
};

const approveProductPrice = async (productPriceId: number): Promise<void> => {
  await axios.post(`${API_URL}/approve/${productPriceId}`);
};

export default {
  getActiveProductPriceBySizeId,
  getAllProductPricesBySizeId,
  getAllPendingProductPrices,
  createNewProductPrice,
  approveProductPrice,
};
