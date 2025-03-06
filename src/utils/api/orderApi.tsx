import axios from 'axios';
import { variables } from './variables';

const API_URL = variables.ORDER_API;

// Định nghĩa kiểu dữ liệu cho một Order (tùy chỉnh theo cấu trúc của bạn)
interface Order {
  orderID: string;
  customerID: string;
  dateTime: string;
  totalPrice: number;
  paymentType: string;
  status: string;
  orderItems?: OrderItem[];
}

interface OrderItem {
  product: {
    imageURL: string;
    name: string;
  };
  productSize: {
    size: string;
    price: number;
  };
  quantity: number;
}

// Lấy tất cả orders
const getOrders = async (): Promise<Order[]> => {
  const response = await axios.get<Order[]>(API_URL);
  return response.data;
};

// Lấy orders theo userId
const getOrdersByUserId = async (userId: string): Promise<Order[]> => {
  const response = await axios.get<Order[]>(`${API_URL}/customer/${userId}`);
  return response.data;
};

// Tạo mới một order
const createOrder = async (order: Omit<Order, 'id'>): Promise<Order> => {
  const response = await axios.post<Order>(API_URL, order);
  return response.data;
};

// Tạo order với PayPal
const createOrderPaypal = async (order: Omit<Order, 'id'>): Promise<Order> => {
  const response = await axios.post<Order>(`${API_URL}/paypal`, order);
  return response.data;
};

// Tạo order với VNPay
const createOrderVnPay = async (order: Omit<Order, 'id'>): Promise<Order> => {
  const response = await axios.post<Order>(`${API_URL}/vnpay`, order);
  return response.data;
};

// Cập nhật một order theo orderId
const updateOrder = async (orderId: string, order: Partial<Order>): Promise<Order> => {
  const response = await axios.put<Order>(`${API_URL}/${orderId}`, order);
  return response.data;
};

// Xóa một order theo orderId
const deleteOrder = async (orderId: string): Promise<void> => {
  await axios.delete(`${API_URL}/${orderId}`);
};

const confirmDelivery = async (orderId: string): Promise<string> => {
  const response = await axios.post(`${API_URL}/confirm-deliver/${orderId}`);
  return response.data;
};


export default {
  getOrders,
  getOrdersByUserId,
  createOrder,
  createOrderPaypal,
  createOrderVnPay,
  updateOrder,
  deleteOrder,
  confirmDelivery,
};
