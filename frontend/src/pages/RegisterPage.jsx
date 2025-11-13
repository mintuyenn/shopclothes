import { useState, useEffect } from "react";
import { register as registerService } from "../services/authService";
import { useAuth } from "../context/AuthContext";
import { getProfile } from "../services/userService";
import {
  User,
  Lock,
  Mail,
  Phone,
  Home,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function RegisterPage() {
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    fullName: "",
    email: "",
    phone: "",
    address: "",
  });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [focusInput, setFocusInput] = useState("");

  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => setMessage(""), 2000);
    return () => clearTimeout(timer);
  }, [message]);

  // Regex kiểm tra
  const regex = {
    password:
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+[\]{};':"\\|,.<>/?]).{6,}$/,
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    phone: /^\d{10}$/,
  };

  // Kiểm tra lỗi real-time
  const validateField = (name, value) => {
    let error = "";
    if (!value.trim()) {
      error = "Trường này không được để trống";
    } else {
      if (name === "password" && !regex.password.test(value))
        error = "Mật khẩu ≥6 ký tự, gồm hoa, thường, số và ký tự đặc biệt.";
      if (name === "email" && !regex.email.test(value))
        error = "Email không hợp lệ.";
      if (name === "phone" && !regex.phone.test(value))
        error = "Số điện thoại phải gồm 10 chữ số.";
    }
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    validateField(name, value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      validateField(key, formData[key]);
      if (!formData[key].trim()) newErrors[key] = "Không được bỏ trống";
    });
    if (Object.values(newErrors).some((err) => err)) return;

    try {
      const res = await registerService(formData);
      if (res.token) {
        const profile = await getProfile(res.token);
        login({ token: res.token, user: profile.data });
      }

      setMessage(res.message || "Đăng ký thành công");
      setMessageType("success");
      setFormData({
        username: "",
        password: "",
        fullName: "",
        email: "",
        phone: "",
        address: "",
      });
      setErrors({});
    } catch (err) {
      setMessage(err.response?.data?.message || "Đăng ký thất bại");
      setMessageType("error");
    }
  };

  const getIcon = (field) => {
    const color = focusInput === field ? "text-blue-500" : "text-gray-400";
    switch (field) {
      case "username":
      case "fullName":
        return <User className={`ml-3 h-6 w-6 ${color}`} />;
      case "password":
        return <Lock className={`ml-3 h-6 w-6 ${color}`} />;
      case "email":
        return <Mail className={`ml-3 h-6 w-6 ${color}`} />;
      case "phone":
        return <Phone className={`ml-3 h-6 w-6 ${color}`} />;
      case "address":
        return <Home className={`ml-3 h-6 w-6 ${color}`} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-blue-50 to-pink-100 p-6">
      <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md transition-all duration-500 hover:shadow-pink-200">
        <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-pink-500 text-center mb-8 drop-shadow-sm">
          Tạo tài khoản mới
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {Object.keys(formData).map((field) => (
            <div key={field} className="relative">
              <div
                className={`flex items-center border-2 rounded-xl overflow-hidden transition-all duration-300 
                ${
                  errors[field]
                    ? "border-red-400 focus-within:ring-red-200"
                    : "border-gray-300 focus-within:border-blue-400 focus-within:ring-blue-100"
                } focus-within:ring-2`}
              >
                {getIcon(field)}
                <input
                  name={field}
                  type={field === "password" ? "password" : "text"}
                  placeholder={`Nhập ${
                    field === "fullName"
                      ? "họ và tên"
                      : field === "username"
                      ? "tên đăng nhập"
                      : field
                  }`}
                  value={formData[field]}
                  onChange={handleChange}
                  onFocus={() => setFocusInput(field)}
                  onBlur={() => setFocusInput("")}
                  className="flex-1 h-12 px-3 outline-none text-gray-700 placeholder-gray-400"
                />
              </div>
              {errors[field] && (
                <p className="text-red-500 text-sm mt-1 ml-1 flex items-center gap-1">
                  <AlertCircle size={14} /> {errors[field]}
                </p>
              )}
            </div>
          ))}

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-400 to-pink-400 text-white font-semibold py-3 rounded-xl shadow-md hover:from-blue-500 hover:to-pink-500 hover:scale-105 transition-all duration-300"
          >
            Đăng ký
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          Đã có tài khoản?{" "}
          <Link
            to="/login"
            className="text-blue-500 font-semibold hover:underline"
          >
            Đăng nhập ngay
          </Link>
        </p>

        {message && (
          <div
            className={`mt-5 flex items-center justify-center px-4 py-3 rounded-xl shadow-md transition-all duration-500 ${
              messageType === "success"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {messageType === "success" ? (
              <CheckCircle className="w-5 h-5 mr-2" />
            ) : (
              <AlertCircle className="w-5 h-5 mr-2" />
            )}
            <span>{message}</span>
          </div>
        )}
      </div>
    </div>
  );
}
