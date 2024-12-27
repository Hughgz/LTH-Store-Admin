import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL_AUTHEN = "http://localhost:5049/api/Authen";

// Action async để xử lý đăng nhập
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (loginData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL_AUTHEN}/login-user`, loginData);
      const { token, user } = response.data;
      console.log("Token: ", token);
      console.log("User: ", user)
      return { token, user };
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data.message || "Invalid email or password");
      }
      return rejectWithValue("An error occurred");
    }
  }
);

// Slice cho Auth
const authSlice = createSlice({
    name: "auth",
    initialState: {
      user: JSON.parse(localStorage.getItem("user")) || null, // Khôi phục thông tin người dùng
      token: localStorage.getItem("token") || null, // Khôi phục token
      loading: false,
      error: null,
    },
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
        .addCase(loginUser.fulfilled, (state, action) => {
          state.loading = false;
          state.user = action.payload.user;
          state.token = action.payload.token;
          // Lưu token và thông tin người dùng vào localStorage
          localStorage.setItem("token", action.payload.token);
          localStorage.setItem("user", JSON.stringify(action.payload.user));
        })
        .addCase(loginUser.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        });
    },
  });
  

export const { logout } = authSlice.actions;
export default authSlice.reducer;
