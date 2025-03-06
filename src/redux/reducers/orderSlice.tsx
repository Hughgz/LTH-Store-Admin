// orderSlice.ts

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import orderApi from '../../utils/api/orderApi';

export const confirmOrderDelivery = createAsyncThunk(
  'orders/confirmOrderDelivery',
  async (orderId: string) => {
    const response = await orderApi.confirmDelivery(orderId);
    return response;  // Thông báo thành công
  }
);

const orderSlice = createSlice({
  name: 'orders',
  initialState: {
    orders: [] as Array<{ orderID: string; status: string }>,
    status: 'idle',
    error: null as string | null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(confirmOrderDelivery.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(confirmOrderDelivery.fulfilled, (state, action) => {
        state.status = 'succeeded';
        // Cập nhật trạng thái của đơn hàng trong redux store sau khi giao hàng
        const orderId = action.meta.arg;
        const updatedOrder = state.orders.find((order) => order.orderID === orderId);
        if (updatedOrder) {
          updatedOrder.status = 'Delivered';  // Cập nhật trạng thái
        }
      })
      .addCase(confirmOrderDelivery.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message ?? 'Unknown error';
      });
  }
});

export default orderSlice.reducer;
