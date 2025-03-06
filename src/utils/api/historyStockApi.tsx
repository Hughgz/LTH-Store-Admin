import axios from "axios";
import { variables } from "./variables"; 

interface StockHistoryData {
  stockHistoryID: number;
  updatedDateTime: string;
  productSizeID: number;
  stockChange: number;
  note?: string;
}

const stockHistoryApi = {
  // Lấy lịch sử tồn kho theo productSizeId
  fetchByProductSizeId: async (productSizeId: number): Promise<StockHistoryData[]> => {
    const response = await axios.get<StockHistoryData[]>(`${variables.HISTORYSTOCK_API}/${productSizeId}`);
    console.log('API Response',response.data);
    return response.data;
  },

  // Lấy lịch sử tồn kho theo productSizeId và khoảng thời gian
  fetchByProductSizeIdAndPeriod: async (productSizeId?: number, startDate?: Date, endDate?: Date): Promise<StockHistoryData[]> => {
    const params: { [key: string]: string | number | undefined } = {
      productSizeId,
      startDate: startDate?.toISOString(),
      endDate: endDate?.toISOString(),
    };

    const response = await axios.get<StockHistoryData[]>(variables.HISTORYSTOCK_API,{ params });
    console.log("API Response with Filters:", response.data);
    return response.data;
  },
};

export default stockHistoryApi;
