import axios from "axios";
import { variables } from "./variables";

interface StockHistoryData {
  StockHistoryID: number;
  UpdatedDateTime: string;
  ProductSizeID: number;
  StockChange: number;
  Note?: string;
}

const stockHistoryApi = {
  fetchByProductSizeId: async (productSizeId: number): Promise<StockHistoryData[]> => {
    const response = await axios.get<StockHistoryData[]>(`${variables.HISTORYSTOCK_API}/${productSizeId}`);
    return response.data;
  },

  fetchByPeriod: async (params: { productSizeId: number; fromDate: string; toDate: string }): Promise<StockHistoryData[]> => {
    const { productSizeId, fromDate, toDate } = params;
    const response = await axios.get<StockHistoryData[]>(`${variables.HISTORYSTOCK_API}/period`, {
      params: { productSizeId, fromDate, toDate },
    });
    return response.data;
  },
};

export default stockHistoryApi;