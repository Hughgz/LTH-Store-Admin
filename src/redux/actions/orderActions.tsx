import { createAsyncThunk } from '@reduxjs/toolkit';
import orderApi from '../../utils/api/orderApi';

export const fetchOrders = createAsyncThunk(
  'orders/fetchOrders',
  async () => {
    const orders = await orderApi.getOrders();
    return orders;
  }
);

export const confirmOrderDelivery = createAsyncThunk(
  'orders/confirmOrderDelivery',
  async (orderId: string) => {
    const response = await orderApi.confirmDelivery(orderId);
    console.log(response);
    return response;  
  }
);