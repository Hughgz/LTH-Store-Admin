import axios from "axios";
import { variables } from "./variables";

interface RevenueData {
  id: number;
  date: string;
  amount: number;
}

const revenueApi = {
  fetchAll: async (): Promise<RevenueData[]> => {
    const response = await axios.get<RevenueData[]>(variables.REVENUE_API);
    return response.data;
  },

  fetchByPeriod: async (params: { fromDate: string; toDate: string }): Promise<RevenueData[]> => {
    const { fromDate, toDate } = params;
    const response = await axios.get<RevenueData[]>(`${variables.REVENUE_API}/period`, {
      params: {
        yearFrom: new Date(fromDate).getFullYear(),
        monthFrom: new Date(fromDate).getMonth() + 1,
        dayFrom: new Date(fromDate).getDate(),
        yearTo: new Date(toDate).getFullYear(),
        monthTo: new Date(toDate).getMonth() + 1,
        dayTo: new Date(toDate).getDate(),
      },
    });
    return response.data;
  },
};

export default revenueApi;
