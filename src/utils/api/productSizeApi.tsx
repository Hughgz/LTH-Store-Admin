import axios from "axios";
import { variables } from "./variables";

const API_URL = variables.PRODUCTSIZE_API;

const productSizeApi = {
  // 🟢 Lấy ProductSize theo ID
  getByIdProductSize: async (id: number) => {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  },

  // 🔵 Lấy tất cả ProductSize
  getAllProductSizes: async () => {
    const response = await axios.get(API_URL);
    return response.data;
  },
};

export default productSizeApi;
