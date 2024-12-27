import { useForm, SubmitHandler } from "react-hook-form";
import { useAppDispatch, useAppSelector } from "../hooks";
import { loginUser } from "../redux/reducers/authSlice";
import { useNavigate } from "react-router-dom";

// Định nghĩa kiểu dữ liệu cho form
interface LoginFormData {
  email: string;
  password: string;
}

const LoginComponent = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.auth);
  
  // Sử dụng useForm với kiểu LoginFormData
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>();

  // Hàm xử lý khi submit form
  const onSubmit: SubmitHandler<LoginFormData> = async (loginData: LoginFormData) => {
    const resultAction = await dispatch(loginUser(loginData));
    if (loginUser.fulfilled.match(resultAction)) {
      navigate("/"); // Điều hướng tới dashboard khi đăng nhập thành công
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Email Input */}
        <input
          type="email"
          placeholder="Email"
          {...register("email", { required: "Email is required" })}
        />
        {errors.email && <span>{errors.email.message}</span>}

        {/* Password Input */}
        <input
          type="password"
          placeholder="Password"
          {...register("password", { required: "Password is required" })}
        />
        {errors.password && <span>{errors.password.message}</span>}

        {/* Hiển thị thông báo lỗi nếu có */}
        {error && <p className="error-message">{error}</p>}
        
        {/* Button đăng nhập */}
        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
};

export default LoginComponent;
