import { createAsyncThunk } from "@reduxjs/toolkit";
import purchaseReceiptsApi from "../../utils/api/purchaseReceiptsApi";

// Interface cho dữ liệu từ API
interface PurchaseReceipt {
  id?: number;
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
export const fetchPurchaseReceipts = createAsyncThunk<PurchaseReceipt[]>(
  "purchaseReceipts/fetchAll",
  async () => {
    const response = await purchaseReceiptsApi.getAll();
    return response;
  }
);

// Lấy một PurchaseReceipt theo ID
export const fetchPurchaseReceiptById = createAsyncThunk<PurchaseReceipt, number>(
  "purchaseReceipts/fetchById",
  async (id) => {
    const response = await purchaseReceiptsApi.getById(id);
    return response;
  }
);

// Lọc PurchaseReceipts theo điều kiện
export const fetchPurchaseReceiptsByFilter = createAsyncThunk<PurchaseReceipt[], object>(
  "purchaseReceipts/fetchByFilter",
  async (filterParams) => {
    const response = await purchaseReceiptsApi.getByFilter(filterParams);
    return response;
  }
);

// Tạo mới PurchaseReceipt
export const createPurchaseReceipt = createAsyncThunk<PurchaseReceipt, PurchaseReceipt>(
  "purchaseReceipts/create",
  async (data) => {
    const response = await purchaseReceiptsApi.create(data);
    return response;
  }
);

// Cập nhật PurchaseReceipt
export const updatePurchaseReceipt = createAsyncThunk<
  PurchaseReceipt,
  { id: number; data: Partial<PurchaseReceipt> }
>("purchaseReceipts/update", async ({ id, data }) => {
  const response = await purchaseReceiptsApi.update(id, data);
  return response;
});

// Xác nhận PurchaseReceipt
export const confirmPurchaseReceipt = createAsyncThunk<PurchaseReceipt, number>(
  "purchaseReceipts/confirm",
  async (id) => {
    const response = await purchaseReceiptsApi.confirm(id);
    return response;
  }
);
