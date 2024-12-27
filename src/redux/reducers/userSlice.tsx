import { createSlice } from "@reduxjs/toolkit";
import { RootState } from '../../store';



// Giá trị ban đầu với kiểm tra client-side
const initialState = {
  currentUser:
    typeof window !== "undefined"
      ? localStorage.getItem("currentUser")
      : null,
  token:
    typeof window !== "undefined" ? localStorage.getItem("token") || "" : "",
  isLoading: false,
  error: null,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logout: (state) => {
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        localStorage.removeItem("currentUser");
      }
      state.currentUser = null;
      state.token = "";
    },
    setUser: (state, action) => {
      state.currentUser = action.payload;
      if (typeof window !== "undefined") {
        localStorage.setItem("currentUser", JSON.stringify(action.payload));
      }
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { logout, setUser, setLoading, setError } = userSlice.actions;

export const selectToken = (state: RootState) => state.user.token;
export const selectCurrentUser = (state: RootState) => state.user.currentUser;
export const selectIsLoading = (state: RootState) => state.user.isLoading;
export const selectError = (state: RootState) => state.user.error;

export default userSlice.reducer;
