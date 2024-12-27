import { useAppDispatch, useAppSelector } from "./hooks";
import { loginUser, logout } from "../features/auth/authSlice";

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const authState = useAppSelector((state) => state.auth);

  const login = (loginData) => {
    return dispatch(loginUser(loginData));
  };  

  const logoutUser = () => {
    dispatch(logout());
  };

  return { ...authState, login, logoutUser };
};
