import { createAsyncThunk } from "@reduxjs/toolkit";
import userApi from "../../utils/api/userApi";


interface User {
  customerID: string;
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  postalCode: string;
}
// Lấy danh sách người dùng
export const getUsers = createAsyncThunk("user/getUsers", async () => {
  const users = await userApi.getUsers();
  return users;
});

// Lấy thông tin người dùng theo ID
export const getUser = createAsyncThunk<User, number>(
  "user/getUser",
  async (userId: number) => {
    const user = await userApi.getUser(userId); // Đảm bảo userId là number
    return user;
  }
);
