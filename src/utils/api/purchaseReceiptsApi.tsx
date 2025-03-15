import axios from "axios";
import { variables } from "./variables"; // Lấy URL API từ biến môi trường

const API_URL = variables.PurchaseReceipt_API;

interface PurchaseReceipt {
  dateTime: string;
  totalPrice: number;
  status: number;
  paymentType: string;
  transactionID: string;
  supplierId: number;
  details: {
    purchaseReceiptID: number;
    productSizeID: number;
    unit: string;
    quantity: number;
    rawPrice: number;
  }[];
}

// Lấy tất cả PurchaseReceipts
const getAll = async (): Promise<PurchaseReceipt[]> => {
  const response = await axios.get(API_URL);
  return response.data;
};

// Lấy PurchaseReceipt theo ID
const getById = async (id: number): Promise<PurchaseReceipt> => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
};

// Lọc PurchaseReceipts theo điều kiện
const getByFilter = async (filterParams: object): Promise<PurchaseReceipt[]> => {
  const response = await axios.get(`${API_URL}/by-filter`, { params: filterParams });
  return response.data;
};

// Tạo mới PurchaseReceipt
const create = async (data: PurchaseReceipt): Promise<PurchaseReceipt> => {
  const response = await axios.post(API_URL, data);
  return response.data;
};

// Cập nhật PurchaseReceipt
const update = async (id: number, data: Partial<PurchaseReceipt>): Promise<PurchaseReceipt> => {
  const response = await axios.put(`${API_URL}/${id}`, data);
  return response.data;
};

// Xác nhận PurchaseReceipt
const confirm = async (id: string, data: object): Promise<PurchaseReceipt> => {
  const response = await axios.post(`${API_URL}/confirm/${id}`, data);
  return response.data;
};


export default {
  getAll,
  getById,
  getByFilter,
  create,
  update,
  confirm,
};
