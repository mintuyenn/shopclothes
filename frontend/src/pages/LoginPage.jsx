import { useState } from "react";
import { login as loginService } from "../services/authService";
import { useAuth } from "../context/AuthContext";
import { getProfile } from "../services/userService";
import { Link, useNavigate } from "react-router-dom";
import { User, Lock } from "lucide-react";
import * as Motion from "framer-motion"; // ✅ Đổi cách import

export default function LoginPage() {
  const { login } = useAuth();
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [message, setMessage] = useState("");
  const [focusInput, setFocusInput] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const validateForm = () => {
    const newErrors = {};
    if (!formData.username.trim())
      newErrors.username = "Vui lòng nhập tên đăng nhập";
    if (!formData.password.trim())
      newErrors.password = "Vui lòng nhập mật khẩu";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    if (!validateForm()) return;

    try {
      const res = await loginService(formData);
      const profileRes = await getProfile(res.token);
      const user = profileRes.user || profileRes.data?.user;

      if (!user) throw new Error("Không lấy được thông tin người dùng");

      login({ token: res.token, user });
      setMessage("Đăng nhập thành công ✅");

      setTimeout(() => {
        navigate(user.role === "admin" ? "/admin" : "/");
      }, 800);
    } catch (err) {
      setMessage(
        err.response?.data?.message || "Sai tài khoản hoặc mật khẩu ❌"
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-pink-50 to-white flex items-center justify-center px-4">
      <Motion.motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="w-full max-w-md bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl border border-gray-100 p-8"
      >
        <div className="text-center mb-6">
          <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-pink-500 drop-shadow-md">
            Đăng nhập người dùng
          </h2>
          <p className="text-gray-500 text-sm mt-2">
            Chào mừng quay lại! Hãy đăng nhập để tiếp tục.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Username */}
          <div>
            <div className="flex items-center border border-gray-300 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-blue-300 bg-white transition-all">
              <User
                className={`ml-3 h-5 w-5 ${
                  focusInput === "username" ? "text-blue-500" : "text-gray-400"
                }`}
              />
              <input
                name="username"
                placeholder="Tên đăng nhập"
                value={formData.username}
                onChange={handleChange}
                onFocus={() => setFocusInput("username")}
                onBlur={() => setFocusInput("")}
                className="flex-1 h-12 px-3 outline-none text-gray-700 placeholder-gray-400 bg-transparent"
              />
            </div>
            {errors.username && (
              <p className="text-red-500 text-sm mt-1 ml-1">
                {errors.username}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <div className="flex items-center border border-gray-300 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-pink-300 bg-white transition-all">
              <Lock
                className={`ml-3 h-5 w-5 ${
                  focusInput === "password" ? "text-pink-500" : "text-gray-400"
                }`}
              />
              <input
                name="password"
                type="password"
                placeholder="Mật khẩu"
                value={formData.password}
                onChange={handleChange}
                onFocus={() => setFocusInput("password")}
                onBlur={() => setFocusInput("")}
                className="flex-1 h-12 px-3 outline-none text-gray-700 placeholder-gray-400 bg-transparent"
              />
            </div>
            {errors.password && (
              <p className="text-red-500 text-sm mt-1 ml-1">
                {errors.password}
              </p>
            )}
          </div>

          <Motion.motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            type="submit"
            className="w-full bg-gradient-to-r from-blue-400 to-pink-400 text-white font-semibold py-3 rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
          >
            Đăng nhập
          </Motion.motion.button>
        </form>

        {message && (
          <Motion.motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`mt-4 text-center font-medium ${
              message.includes("✅") ? "text-green-600" : "text-red-600"
            }`}
          >
            {message}
          </Motion.motion.p>
        )}

        <div className="mt-6 text-center space-y-2">
          <p className="text-sm text-gray-600">
            Bạn chưa có tài khoản?{" "}
            <Link
              to="/register"
              className="text-blue-500 font-semibold hover:underline"
            >
              Đăng ký ngay
            </Link>
          </p>
          <p className="text-sm text-gray-600">
            <Link
              to="/forgot-password"
              className="text-pink-500 font-semibold hover:underline"
            >
              Quên mật khẩu?
            </Link>
          </p>
        </div>
      </Motion.motion.div>
    </div>
  );
}
