import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import * as Motion from "framer-motion";
import { ArrowRight, Loader2, AlertCircle, CheckCircle } from "lucide-react";

import { register as registerService } from "../services/authService";
import { useAuth } from "../context/AuthContext";
import { getProfile } from "../services/userService";

export default function RegisterPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
    phone: "",
    address: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Cấu hình các trường input để render gọn hơn
  const formFields = [
    {
      name: "fullName",
      label: "Họ và tên",
      type: "text",
      placeholder: "Nguyễn Văn A",
    },
    {
      name: "username",
      label: "Tên đăng nhập",
      type: "text",
      placeholder: "user123",
    },
    {
      name: "email",
      label: "Email",
      type: "email",
      placeholder: "example@mail.com",
    },
    {
      name: "phone",
      label: "Số điện thoại",
      type: "text",
      placeholder: "0901234567",
    },
    {
      name: "address",
      label: "Địa chỉ",
      type: "text",
      placeholder: "Số nhà, đường...",
    },
    {
      name: "password",
      label: "Mật khẩu",
      type: "password",
      placeholder: "••••••••",
    },
  ];

  // Regex rules
  const regex = {
    password:
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+[\]{};':"\\|,.<>/?]).{6,}$/,
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    phone: /^\d{10}$/,
  };

  // Tự động ẩn thông báo sau 3s
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const validateField = (name, value) => {
    let error = "";
    if (!value.trim()) {
      error = "Bắt buộc nhập";
    } else {
      if (name === "password" && !regex.password.test(value))
        error = "Mật khẩu yếu (Cần: Hoa, thường, số, ký tự đặc biệt)";
      if (name === "email" && !regex.email.test(value))
        error = "Email không hợp lệ";
      if (name === "phone" && !regex.phone.test(value))
        error = "SĐT phải có 10 số";
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
      // Check lại regex lần cuối khi submit
      if (key === "password" && !regex.password.test(formData[key]))
        newErrors[key] = "Mật khẩu chưa đạt yêu cầu";
      if (key === "email" && !regex.email.test(formData[key]))
        newErrors[key] = "Email sai định dạng";
    });

    if (Object.values(newErrors).some((err) => err)) {
      setErrors(newErrors); // Cập nhật lại toàn bộ lỗi nếu có
      return;
    }

    setLoading(true);
    try {
      const res = await registerService(formData);

      // Auto login sau khi đăng ký thành công
      if (res.token) {
        const profile = await getProfile(res.token);
        login({ token: res.token, user: profile.data });
      }

      setMessage("Đăng ký thành công! Đang chuyển hướng...");
      setTimeout(() => navigate("/"), 1500);
    } catch (err) {
      setMessage(err.response?.data?.message || "Đăng ký thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white font-sans text-slate-900 selection:bg-black selection:text-white">
      {/* 1. LEFT SIDE - IMAGE (Cố định) */}
      <Motion.motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="hidden lg:block w-[45%] fixed left-0 top-0 bottom-0 bg-gray-100 overflow-hidden"
      >
        <img
          src="https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070&auto=format&fit=crop"
          alt="Fashion Register"
          className="absolute inset-0 w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000 ease-out"
        />
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="absolute bottom-12 left-12 text-white z-10 max-w-md">
          <h2 className="text-5xl font-black uppercase tracking-tighter mb-4">
            Join The Club
          </h2>
          <p className="text-lg font-light opacity-90">
            Trở thành thành viên để nhận ưu đãi độc quyền và cập nhật xu hướng
            mới nhất.
          </p>
        </div>
      </Motion.motion.div>

      {/* 2. RIGHT SIDE - SCROLLABLE FORM */}
      <div className="w-full lg:w-[55%] lg:ml-[45%] min-h-screen flex flex-col justify-center items-center py-16 px-6 md:px-16">
        <Motion.motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-2xl"
        >
          {/* Header Mobile Only */}
          <div className="lg:hidden text-center mb-10">
            <h1 className="text-4xl font-black uppercase tracking-tighter">
              Đăng ký tài khoản
            </h1>
            <p className="text-slate-500 mt-2">
              Tạo tài khoản mới để bắt đầu mua sắm ngay thôi!
            </p>
          </div>

          {/* Header Desktop */}
          <div className="hidden lg:block mb-12">
            <h1 className="text-4xl font-bold tracking-tight text-slate-900 mb-2">
              Tạo tài khoản mới
            </h1>
            <p className="text-slate-500">
              Tạo tài khoản để nhận những ưu đãi và trải nghiệm mua sắm tốt
              nhất!
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* GRID LAYOUT: 2 Cột để form gọn hơn */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8">
              {formFields.map((field) => (
                <div
                  key={field.name}
                  className={`group ${
                    field.name === "address" ? "md:col-span-2" : ""
                  }`}
                >
                  <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2 group-focus-within:text-black transition-colors">
                    {field.label} <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      name={field.name}
                      type={field.type}
                      placeholder={field.placeholder}
                      value={formData[field.name]}
                      onChange={handleChange}
                      className={`w-full border-b py-3 text-slate-900 bg-transparent placeholder-gray-300 focus:outline-none transition-all duration-300
                        ${
                          errors[field.name]
                            ? "border-red-500 focus:border-red-600"
                            : "border-gray-300 focus:border-black"
                        }`}
                    />
                    {/* Icon cảnh báo lỗi */}
                    {errors[field.name] && (
                      <AlertCircle className="absolute right-0 top-3 text-red-500 h-5 w-5" />
                    )}
                  </div>
                  {/* Text lỗi */}
                  {errors[field.name] && (
                    <p className="text-red-600 text-xs mt-2 font-medium">
                      {errors[field.name]}
                    </p>
                  )}
                </div>
              ))}
            </div>

            {/* Error / Success Message */}
            {message && (
              <Motion.motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className={`flex items-center gap-3 p-4 text-sm font-medium border ${
                  message.includes("thành công")
                    ? "bg-green-50 border-green-200 text-green-800"
                    : "bg-red-50 border-red-200 text-red-800"
                }`}
              >
                {message.includes("thành công") ? (
                  <CheckCircle size={18} />
                ) : (
                  <AlertCircle size={18} />
                )}
                {message}
              </Motion.motion.div>
            )}

            {/* Submit Button */}
            <Motion.motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              disabled={loading}
              className="w-full bg-slate-900 text-white h-14 rounded-sm flex items-center justify-center gap-2 hover:bg-black transition-all duration-300 disabled:opacity-70 shadow-lg hover:shadow-xl mt-4"
            >
              {loading ? (
                <Loader2 className="animate-spin h-5 w-5" />
              ) : (
                <>
                  <span className="text-sm font-bold uppercase tracking-widest">
                    Đăng ký thành viên
                  </span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Motion.motion.button>
          </form>

          {/* Footer Link */}
          <div className="mt-12 text-center border-t border-gray-100 pt-8">
            <p className="text-slate-500 text-sm">
              Bạn đã có tài khoản?{" "}
              <Link
                to="/login"
                className="text-black font-bold border-b border-black pb-0.5 hover:text-red-600 hover:border-red-600 transition-all ml-1"
              >
                Đăng nhập ngay
              </Link>
            </p>
          </div>
        </Motion.motion.div>
      </div>
    </div>
  );
}
