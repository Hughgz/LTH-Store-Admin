import { createAsyncThunk } from "@reduxjs/toolkit";
import productSizeApi from "../../utils/api/productSizeApi";

// 🟢 Action: Lấy ProductSize theo ID
export const getByIdProductSize = createAsyncThunk(
  "productSize/getById",
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await productSizeApi.getByIdProductSize(id);
      return response; // Trả về dữ liệu productSize từ API
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Failed to fetch productSize");
    }
  }
);

// 🔵 Action: Lấy danh sách tất cả ProductSize
export const getAllProductSizes = createAsyncThunk(
  "productSize/getAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await productSizeApi.getAllProductSizes();
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Failed to fetch product sizes");
    }
  }
);
