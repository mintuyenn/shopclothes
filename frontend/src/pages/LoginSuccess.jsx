import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // Import context của bạn
import { Loader2 } from "lucide-react";

const LoginSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth(); // Hàm login từ context (để lưu user)

  useEffect(() => {
    // 1. Lấy token từ URL (?token=...)
    const token = searchParams.get("token");

    if (token) {
      // 2. Lưu token vào localStorage (hoặc gọi hàm login của context)
      // Nếu context của bạn tự xử lý localStorage thì chỉ cần gọi login(token)
      // Nếu không, bạn tự set: localStorage.setItem("token", token);

      // Giả sử hàm login của bạn nhận object { token, user } hoặc chỉ token,
      // Ở đây ta tạm lưu token và fetch profile sau hoặc reload
      localStorage.setItem("token", token);

      // (Tùy chọn) Gọi hàm cập nhật state global nếu cần
      // login({ token });

      // 3. Chuyển hướng về trang chủ ngay lập tức
      // Dùng setTimeout nhỏ để đảm bảo lưu xong token
      setTimeout(() => {
        window.location.href = "/"; // Reload lại trang để App cập nhật Auth mới
      }, 100);
    } else {
      // Nếu không có token thì đá về login
      navigate("/login");
    }
  }, [navigate, searchParams, login]);

  // Hiển thị màn hình chờ xoay xoay trong lúc xử lý
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center">
        <Loader2 className="w-10 h-10 animate-spin text-slate-900 mx-auto mb-4" />
        <p className="text-slate-500 font-medium">Đang đăng nhập...</p>
      </div>
    </div>
  );
};

export default LoginSuccess;
