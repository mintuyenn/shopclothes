import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  checkEmailExists,
  forgotPassword,
  resetPassword,
} from "../services/authService";
import {
  Mail,
  Lock,
  ArrowLeft,
  Eye,
  EyeOff,
  KeyRound,
  CheckCircle,
  Bug,
} from "lucide-react";

export default function ForgotPasswordPage() {
  const navigate = useNavigate();

  // State quản lý Step
  const [step, setStep] = useState(1); // 1: Email, 2: OTP & New Pass, 3: Success

  // Form State
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // UI State & Dev State
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [countdown, setCountdown] = useState(0);

  // 🔥 STATE MỚI: Lưu OTP giả lập để hiển thị
  const [demoOtp, setDemoOtp] = useState("");

  // --- LOGIC GỬI OTP (STEP 1) ---
  const handleSendOtp = async (e) => {
    if (e) e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // 1. Kiểm tra email
      const checkRes = await checkEmailExists(email);
      if (!checkRes.exists) {
        throw new Error("Email này chưa được đăng ký trong hệ thống.");
      }

      // 2. Gửi OTP (Giả lập)
      // Giả sử API trả về { message: "...", otp: "123456" }
      const res = await forgotPassword(email);

      // 🔥 LẤY OTP TỪ RESPONSE ĐỂ HIỂN THỊ
      if (res && res.otp) {
        setDemoOtp(res.otp);
      }

      // 3. Chuyển bước
      setStep(2);
      setCountdown(60);
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Có lỗi xảy ra.");
    } finally {
      setLoading(false);
    }
  };

  // --- LOGIC ĐẶT LẠI MẬT KHẨU (STEP 2) ---
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp.");
      return;
    }
    if (password.length < 6) {
      setError("Mật khẩu phải có ít nhất 6 ký tự.");
      return;
    }

    setLoading(true);
    try {
      await resetPassword({ email, newPassword: password, otp });
      setStep(3);
    } catch (err) {
      setError(
        err.response?.data?.message || "OTP không đúng hoặc đã hết hạn."
      );
    } finally {
      setLoading(false);
    }
  };

  // --- LOGIC ĐẾM NGƯỢC ---
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        {/* Header */}
        {step !== 3 && (
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-50 text-blue-600 mb-4">
              <KeyRound size={24} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">
              {step === 1 ? "Quên mật khẩu?" : "Đặt lại mật khẩu"}
            </h2>
            <p className="text-gray-500 text-sm mt-2">
              {step === 1
                ? "Nhập email của bạn để nhận mã xác thực."
                : `Mã xác thực đã được gửi tới ${email}`}
            </p>
          </div>
        )}

        {/* STEP 1: NHẬP EMAIL */}
        {step === 1 && (
          <form onSubmit={handleSendOtp} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email đăng ký
              </label>
              <div className="relative">
                <Mail
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                  placeholder="name@example.com"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="text-red-500 text-sm bg-red-50 p-3 rounded-lg">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black hover:bg-gray-800 text-white font-bold py-3 rounded-lg transition-all flex items-center justify-center"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                "Gửi mã xác thực"
              )}
            </button>
          </form>
        )}

        {/* STEP 2: NHẬP OTP & PASSWORD MỚI */}
        {step === 2 && (
          <form onSubmit={handleResetPassword} className="space-y-5">
            {/* 🔥 HIỂN THỊ OTP GIẢ LẬP (DEV MODE) */}
            {demoOtp && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 flex items-start gap-3 animate-pulse">
                <Bug
                  className="text-yellow-600 min-w-[20px] mt-0.5"
                  size={20}
                />
                <div className="text-sm text-yellow-800">
                  <span className="font-bold block">Dev Mode (Giả lập):</span>
                  Mã OTP của bạn là:{" "}
                  <span className="font-mono text-lg font-bold bg-yellow-200 px-1 rounded">
                    {demoOtp}
                  </span>
                </div>
              </div>
            )}

            {/* Input OTP */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mã OTP
              </label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-center text-xl tracking-widest font-mono"
                placeholder="######"
                maxLength={6}
                required
              />
            </div>

            {/* Input Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mật khẩu mới
              </label>
              <div className="relative">
                <Lock
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPass ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Input Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Xác nhận mật khẩu
              </label>
              <div className="relative">
                <Lock
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="text-red-500 text-sm bg-red-50 p-3 rounded-lg">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black hover:bg-gray-800 text-white font-bold py-3 rounded-lg transition-all flex items-center justify-center"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                "Đổi mật khẩu"
              )}
            </button>

            <div className="text-center text-sm">
              {countdown > 0 ? (
                <span className="text-gray-400">
                  Gửi lại mã sau {countdown}s
                </span>
              ) : (
                <button
                  type="button"
                  onClick={(e) => handleSendOtp(e)}
                  className="text-blue-600 hover:underline font-medium"
                >
                  Gửi lại mã OTP
                </button>
              )}
            </div>
          </form>
        )}

        {/* STEP 3: SUCCESS */}
        {step === 3 && (
          <div className="text-center py-6">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={32} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Thành công!
            </h2>
            <p className="text-gray-500 mb-8">
              Mật khẩu của bạn đã được đặt lại.
            </p>
            <button
              onClick={() => navigate("/login")}
              className="w-full bg-black hover:bg-gray-800 text-white font-bold py-3 rounded-lg transition-all"
            >
              Đăng nhập ngay
            </button>
          </div>
        )}

        {step !== 3 && (
          <div className="mt-8 pt-6 border-t border-gray-100 text-center">
            <Link
              to="/login"
              className="inline-flex items-center text-gray-500 hover:text-gray-900 font-medium transition-colors"
            >
              <ArrowLeft size={16} className="mr-2" /> Quay lại đăng nhập
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
