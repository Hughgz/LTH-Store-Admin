import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  fetchPurchaseReceipts,
  fetchPurchaseReceiptById,
  fetchPurchaseReceiptsByFilter,
  createPurchaseReceipt,
  updatePurchaseReceipt,
  confirmPurchaseReceipt,
} from "../actions/purchaseReceiptsActions";

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

interface PurchaseReceiptState {
  purchaseReceipts: PurchaseReceipt[];
  selectedPurchaseReceipt: PurchaseReceipt | null;
  loading: boolean;
  error: string | null;
}

const initialState: PurchaseReceiptState = {
  purchaseReceipts: [],
  selectedPurchaseReceipt: null,
  loading: false,
  error: null,
};

const purchaseReceiptsSlice = createSlice({
  name: "purchaseReceipts",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPurchaseReceipts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPurchaseReceipts.fulfilled, (state, action: PayloadAction<PurchaseReceipt[]>) => {
        state.loading = false;
        state.purchaseReceipts = action.payload;
      })
      .addCase(fetchPurchaseReceipts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch purchase receipts";
      })

      .addCase(fetchPurchaseReceiptById.fulfilled, (state, action: PayloadAction<PurchaseReceipt>) => {
        state.selectedPurchaseReceipt = action.payload;
      })

      .addCase(fetchPurchaseReceiptsByFilter.fulfilled, (state, action: PayloadAction<PurchaseReceipt[]>) => {
        state.purchaseReceipts = action.payload;
      })

      .addCase(createPurchaseReceipt.fulfilled, (state, action: PayloadAction<PurchaseReceipt>) => {
        state.purchaseReceipts.push(action.payload);
      })

      .addCase(updatePurchaseReceipt.fulfilled, (state, action: PayloadAction<PurchaseReceipt>) => {
        state.purchaseReceipts = state.purchaseReceipts.map((receipt) =>
          receipt.id === action.payload.id ? action.payload : receipt
        );
      })

      .addCase(confirmPurchaseReceipt.fulfilled, (state, action: PayloadAction<PurchaseReceipt>) => {
        state.purchaseReceipts = state.purchaseReceipts.map((receipt) =>
          receipt.id === action.payload.id ? { ...receipt, status: 2 } : receipt
        );
      });
  },
});

export default purchaseReceiptsSlice.reducer;
