import axios from 'axios';
import { variables } from './variables';

const API_URL = variables.CUSTOMER_API;
const API_URL_AUTHEN = variables.AUTHEN_API;
const API_URL_CART_ITEM = variables.CART_ITEM_API;

// Định nghĩa kiểu dữ liệu
interface User {
  customerID: string;
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  postalCode: string;
}

interface LoginData {
  email: string;
  password: string;
}

interface CartItem {
  customerId: number;
  productSizeID: string;
  quantity: number;
}

// Lấy danh sách người dùng
const getUsers = async (): Promise<User[]> => {
  const response = await axios.get<User[]>(API_URL);
  return response.data;
};

// Lấy thông tin người dùng theo ID
const getUser = async (userId: number): Promise<User> => {
  console.log('userId', userId);
  const response = await axios.get<User>(`${API_URL}/${userId}`);
  return response.data;
};

// Tạo người dùng mới
const createUser = async (user: User): Promise<User> => {
  const response = await axios.post<User>(API_URL, user);
  return response.data;
};

// Đăng ký người dùng
const registerUser = async (user: User): Promise<User> => {
  const response = await axios.post<User>(`${API_URL_AUTHEN}/register`, user);
  return response.data;
};

// Cập nhật thông tin người dùng
const updateUser = async (userId: string, user: User): Promise<User> => {
  const response = await axios.put<User>(`${API_URL}/${userId}`, user);
  return response.data;
};

// Xóa người dùng
const deleteUser = async (userId: string): Promise<void> => {
  await axios.delete(`${API_URL}/${userId}`);
};

// Đăng nhập
const login = async (loginData: LoginData): Promise<number | { token: null }> => {
  try {
    const response = await axios.post(`${API_URL_AUTHEN}/login-customer`, loginData);
    if (response.data.token) {
      const userId: number = Number(response.data.customer.customerID); // Chuyển về `number`
      console.log("userId: ", userId);

      // Xử lý sessionStorage
      const data = sessionStorage.getItem("cartItems");
      if (data) {
        const cartItems: CartItem[] = JSON.parse(data).map((item: any) => ({
          customerId: userId,
          productSizeID: item.productSizeID,
          quantity: item.quantity,
        }));

        try {
          await axios.post(`${API_URL_CART_ITEM}/updateSession`, cartItems);
          sessionStorage.removeItem("cartItems");
          console.log("Cart items have been successfully updated to the server.");
        } catch (error) {
          console.error("Error updating cart items to the server:", error);
        }
      } else {
        console.log("No cart items found in sessionStorage.");
      }

      return userId; // Trả về `number`
    }
    return { token: null };
  } catch (error: any) {
    if (error.response && error.response.status === 401) {
      alert("Invalid email or password");
    } else {
      alert("An error occurred");
    }
    return { token: null };
  }
};


export default {
  login,
  getUser,
  getUsers,
  createUser,
  registerUser,
  updateUser,
  deleteUser,
};
