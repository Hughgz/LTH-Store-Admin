import { useAppDispatch, useAppSelector } from "../../hooks";
import { loginUser, logout } from "../../redux/reducers/authSlice";
import { RootState } from '../../store';
// Định nghĩa kiểu dữ liệu cho loginData (có thể thay đổi nếu cần)
interface LoginData {
  email: string;
  password: string;
}

export const useAuth = () => {
  const dispatch = useAppDispatch();

  // Lấy trạng thái auth từ Redux store
  const authState = useAppSelector((state: RootState) => state.auth);

  // Hàm login, nhận loginData làm đối số
  const login = (loginData: LoginData) => {
    return dispatch(loginUser(loginData));
  };

  // Hàm logoutUser
  const logoutUser = () => {
    dispatch(logout());
  };

  return { ...authState, login, logoutUser };
};
