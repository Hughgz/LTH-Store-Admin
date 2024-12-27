import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

// Define types for the state
interface User {
  id: number;
  email: string;
  [key: string]: any; // Add other properties as needed
}

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

// Action async để xử lý đăng nhập
interface LoginData {
  email: string;
  password: string;
}

export const loginUser = createAsyncThunk<
  { token: string; user: User }, // The fulfilled action payload type
  LoginData, // The argument type for the thunk
  { rejectValue: string } // The rejected action payload type
>(
  "auth/loginUser",
  async (loginData: LoginData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL_AUTHEN}/login-user`, loginData);
      const { token, user } = response.data;
      console.log("Token: ", token);
      console.log("User: ", user);
      return { token, user };
    } catch (error) {
      return rejectWithValue("An error occurred");
    }
  }
);

const API_URL_AUTHEN = "https://lthshop.azurewebsites.net/api/Authen";

// Slice cho Auth
const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: JSON.parse(localStorage.getItem("user") || "null") as User | null, // Khôi phục thông tin người dùng
    token: localStorage.getItem("token") || null, // Khôi phục token
    loading: false,
    error: null,
  } as AuthState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem("token"); // Xóa token khỏi localStorage khi logout
      localStorage.removeItem("user");  // Xóa thông tin người dùng khỏi localStorage
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        loginUser.fulfilled,
        (state, action: PayloadAction<{ token: string; user: User }>) => {
          state.loading = false;
          state.user = action.payload.user;
          state.token = action.payload.token;
          // Lưu token và thông tin người dùng vào localStorage
          localStorage.setItem("token", action.payload.token);
          localStorage.setItem("user", JSON.stringify(action.payload.user));
        }
      )
      .addCase(
        loginUser.rejected,
        (state, action: PayloadAction<string | undefined>) => {
          state.loading = false;
          // Ensure payload is treated as string if it's undefined
          state.error = action.payload || "An error occurred";
        }
      );
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
