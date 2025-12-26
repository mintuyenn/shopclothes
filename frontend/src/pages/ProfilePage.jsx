import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import * as Motion from "framer-motion";
import {
  AlertCircle,
  CheckCircle,
  User as UserIcon,
  Mail,
  Phone,
  MapPin,
  Shield,
  Trash2,
  Loader2,
  Camera,
} from "lucide-react";

export default function ProfilePage() {
  const { token, logout, loading } = useAuth();
  const [profile, setProfile] = useState(null);

  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [isSavingPwd, setIsSavingPwd] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [message, setMessage] = useState({ text: "", type: "" });

  const [passwords, setPasswords] = useState({ old: "", new: "" });
  const [deletePassword, setDeletePassword] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const API_URL = `${import.meta.env.VITE_API_URL}/api`;

  useEffect(() => {
    if (!token) return;

    const fetchProfile = async () => {
      try {
        const res = await axios.get(`${API_URL}/auth/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile(res.data.user);
      } catch (err) {
        showMessage(
          err.response?.data?.message || "Lỗi tải thông tin",
          "error"
        );
      } finally {
        setIsLoadingProfile(false);
      }
    };

    fetchProfile();
  }, [token]);

  const showMessage = (text, type = "success") => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: "", type: "" }), 3000);
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!passwords.old || !passwords.new) {
      showMessage("Vui lòng nhập đầy đủ mật khẩu", "error");
      return;
    }

    setIsSavingPwd(true);
    try {
      const res = await axios.put(
        `${API_URL}/auth/change-password`,
        {
          currentPassword: passwords.old,
          newPassword: passwords.new,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      showMessage(res.data.message || "Đổi mật khẩu thành công");
      setPasswords({ old: "", new: "" });
    } catch (err) {
      showMessage(
        err.response?.data?.message || "Đổi mật khẩu thất bại",
        "error"
      );
    } finally {
      setIsSavingPwd(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!deletePassword) {
      showMessage("Vui lòng nhập mật khẩu xác nhận", "error");
      return;
    }

    setIsDeleting(true);
    try {
      await axios.delete(`${API_URL}/auth/delete-account`, {
        headers: { Authorization: `Bearer ${token}` },
        data: { password: deletePassword },
      });
      showMessage("Xóa tài khoản thành công");
      logout();
    } catch (err) {
      showMessage(err.response?.data?.message || "Sai mật khẩu", "error");
      setIsDeleting(false);
    }
  };

  if (loading || isLoadingProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="w-10 h-10 animate-spin text-slate-900" />
      </div>
    );
  }

  if (!token || !profile) return null;

  // ✅ FIX ICON: dùng prop `icon` + Component trung gian viết hoa
  const InfoItem = ({ label, value, icon: IconComponent }) => (
    <div>
      <div className="flex items-center gap-2 mb-1">
        <IconComponent size={14} className="text-slate-400" />
        <span className="text-xs font-bold uppercase tracking-widest text-slate-500">
          {label}
        </span>
      </div>
      <div className="border-b border-gray-200 py-2 text-slate-900 font-medium text-lg">
        {value || "Chưa cập nhật"}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4 font-sans text-slate-900">
      <div className="max-w-5xl mx-auto">
        {/* HEADER */}
        <Motion.motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4"
        >
          <div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
              Hồ sơ của bạn
            </h1>
            <p className="text-slate-500 mt-2">
              Quản lý thông tin cá nhân và bảo mật tài khoản.
            </p>
          </div>

          {message.text && (
            <Motion.motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className={`flex items-center gap-2 px-4 py-3 rounded shadow text-sm font-medium ${
                message.type === "success"
                  ? "bg-green-50 text-green-800 border border-green-200"
                  : "bg-red-50 text-red-800 border border-red-200"
              }`}
            >
              {message.type === "success" ? (
                <CheckCircle size={16} />
              ) : (
                <AlertCircle size={16} />
              )}
              {message.text}
            </Motion.motion.div>
          )}
        </Motion.motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT */}
          <div className="lg:col-span-2 bg-white p-10 border border-gray-100">
            <div className="flex items-center gap-6 mb-10 border-b pb-8">
              <div className="relative">
                <div className="w-20 h-20 bg-slate-900 text-white flex items-center justify-center text-3xl font-bold rounded-full">
                  {(profile.username || "U").charAt(0).toUpperCase()}
                </div>
                <div className="absolute bottom-0 right-0 bg-white p-1 rounded-full border">
                  <Camera size={14} />
                </div>
              </div>
              <div>
                <h2 className="text-2xl font-bold">
                  {profile.fullName || profile.username}
                </h2>
                <p className="text-slate-500 text-sm">Thành viên ShopClothes</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <InfoItem
                label="Tên đăng nhập"
                value={profile.username}
                icon={UserIcon}
              />
              <InfoItem label="Email" value={profile.email} icon={Mail} />
              <InfoItem
                label="Số điện thoại"
                value={profile.phone}
                icon={Phone}
              />
              <InfoItem label="Địa chỉ" value={profile.address} icon={MapPin} />
            </div>
          </div>

          {/* RIGHT */}
          <div className="space-y-8">
            {/* SECURITY */}
            <div className="bg-white p-8 border border-gray-100">
              <div className="flex items-center gap-2 mb-6">
                <Shield size={20} />
                <h3 className="font-bold">Bảo mật</h3>
              </div>

              <form onSubmit={handleChangePassword} className="space-y-5">
                <input
                  type="password"
                  placeholder="Mật khẩu hiện tại"
                  className="w-full border-b py-2 focus:outline-none"
                  value={passwords.old}
                  onChange={(e) =>
                    setPasswords({ ...passwords, old: e.target.value })
                  }
                />
                <input
                  type="password"
                  placeholder="Mật khẩu mới"
                  className="w-full border-b py-2 focus:outline-none"
                  value={passwords.new}
                  onChange={(e) =>
                    setPasswords({ ...passwords, new: e.target.value })
                  }
                />
                <button
                  disabled={isSavingPwd}
                  className="w-full bg-slate-900 text-white py-3 text-xs font-bold uppercase tracking-widest flex justify-center gap-2"
                >
                  {isSavingPwd && (
                    <Loader2 className="animate-spin" size={14} />
                  )}
                  Đổi mật khẩu
                </button>
              </form>
            </div>

            {/* DANGER */}
            <div className="bg-white p-8 border border-red-100">
              <h3 className="text-red-600 text-xs font-bold uppercase tracking-widest flex items-center gap-2 mb-4">
                <Trash2 size={14} /> Vùng nguy hiểm
              </h3>
              <button
                onClick={() => setShowDeleteModal(true)}
                className="w-full border border-red-200 text-red-600 py-3 text-xs font-bold uppercase tracking-widest"
              >
                Xóa tài khoản
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* DELETE MODAL */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowDeleteModal(false)}
          />
          <div className="relative bg-white p-8 w-full max-w-md">
            <h3 className="font-bold text-lg mb-4">Xác nhận xóa tài khoản</h3>
            <input
              type="password"
              placeholder="Nhập mật khẩu"
              className="w-full border-b py-3 mb-6 text-center"
              value={deletePassword}
              onChange={(e) => setDeletePassword(e.target.value)}
            />
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 py-3 bg-gray-100 font-bold text-xs uppercase"
              >
                Hủy
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={isDeleting}
                className="flex-1 py-3 bg-red-600 text-white font-bold text-xs uppercase flex justify-center gap-2"
              >
                {isDeleting && <Loader2 className="animate-spin" size={14} />}
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
