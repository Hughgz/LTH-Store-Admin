import { createAsyncThunk } from '@reduxjs/toolkit';
import orderApi from '../../utils/api/orderApi';

export const fetchOrders = createAsyncThunk(
  'orders/fetchOrders',
  async () => {
    const orders = await orderApi.getOrders();
    return orders;
  }
);