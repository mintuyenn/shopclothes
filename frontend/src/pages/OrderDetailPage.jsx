import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import {
  ArrowLeft,
  MapPin,
  Package,
  CreditCard,
  CheckCircle,
  Clock,
  Truck,
  XCircle,
  AlertTriangle,
  Phone,
  User,
} from "lucide-react";
import Swal from "sweetalert2";

// Helper: Xác định bước hiện tại của đơn hàng
const getOrderStep = (status) => {
  const steps = [
    "Chờ xác nhận",
    "Đã xác nhận",
    "Đang vận chuyển",
    "Giao thành công",
  ];
  // Map các trạng thái vào index (0, 1, 2, 3)
  if (status === "Đã xác nhận" || status === "Đang chuẩn bị hàng") return 1;
  if (status === "Đang giao") return 2;
  if (status === "Đã hoàn thành") return 3;
  return steps.indexOf(status);
};

const OrderDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const API_URL = `${import.meta.env.VITE_API_URL}/api`;

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await axios.get(`${API_URL}/orders/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrder(res.data.data);
      } catch (error) {
        console.error("Lỗi tải đơn hàng:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id, token]);

  // --- Xử lý Hủy đơn ---
  const handleCancelOrder = async () => {
    const result = await Swal.fire({
      title: "Hủy đơn hàng?",
      text: "Bạn có chắc chắn muốn hủy đơn hàng này không?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Đồng ý hủy",
      cancelButtonText: "Quay lại",
    });

    if (result.isConfirmed) {
      try {
        const res = await axios.put(
          `${API_URL}/orders/${order._id}/cancel`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );

        Swal.fire("Đã hủy!", res.data.message, "success");
        setOrder({ ...order, orderStatus: "Đã hủy" });
      } catch (err) {
        Swal.fire(
          "Lỗi",
          err.response?.data?.message || "Hủy thất bại",
          "error"
        );
      }
    }
  };

  // --- RENDER LOADING SKELETON ---
  if (loading)
    return (
      <div className="max-w-5xl mx-auto py-10 px-4 space-y-6 animate-pulse">
        <div className="h-8 w-32 bg-gray-200 rounded mb-6"></div>
        <div className="h-24 bg-gray-200 rounded-xl"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="h-64 bg-gray-200 rounded-xl"></div>
          <div className="md:col-span-2 h-64 bg-gray-200 rounded-xl"></div>
        </div>
      </div>
    );

  if (!order)
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <Package size={64} className="text-gray-300 mb-4" />
        <p className="text-xl text-gray-500">Không tìm thấy đơn hàng</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 text-blue-600 hover:underline"
        >
          Quay lại
        </button>
      </div>
    );

  const currentStep = getOrderStep(order.orderStatus);
  const isCancelled = order.orderStatus === "Đã hủy";

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 bg-gray-50/50 min-h-screen">
      {/* 1. Nút quay lại & Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigate("/order-history")}
          className="flex items-center text-gray-600 hover:text-black transition-colors font-medium"
        >
          <ArrowLeft size={20} className="mr-2" /> Quay lại danh sách
        </button>
        <div className="text-sm text-gray-500">
          Mã đơn:{" "}
          <span className="font-mono font-bold text-black">
            #{order.orderCode || order._id.slice(-6).toUpperCase()}
          </span>
        </div>
      </div>

      {/* 2. Trạng thái đơn hàng (Timeline hoặc Alert) */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-6">
        {isCancelled ? (
          <div className="flex items-center gap-4 text-red-600 bg-red-50 p-4 rounded-xl border border-red-100">
            <XCircle size={32} />
            <div>
              <h3 className="font-bold text-lg">Đơn hàng đã bị hủy</h3>
              <p className="text-sm text-red-500">
                Vào lúc: {new Date(order.updatedAt).toLocaleString("vi-VN")}
              </p>
            </div>
          </div>
        ) : (
          <div className="w-full">
            {/* Timeline Visual */}
            <div className="relative flex justify-between items-center mb-2 px-2 md:px-10">
              {/* Progress Bar Background */}
              <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 -z-0"></div>
              {/* Active Progress Bar */}
              <div
                className="absolute top-1/2 left-0 h-1 bg-green-500 -z-0 transition-all duration-500"
                style={{
                  width: `${Math.max(
                    0,
                    Math.min(100, (currentStep / 3) * 100)
                  )}%`,
                }}
              ></div>

              {["Chờ xác nhận", "Đã xác nhận", "Vận chuyển", "Hoàn thành"].map(
                (label, index) => {
                  const isActive = index <= currentStep;
                  return (
                    <div
                      key={index}
                      className="flex flex-col items-center bg-white z-10 p-1"
                    >
                      <div
                        className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center border-2 transition-colors duration-300
                                    ${
                                      isActive
                                        ? "bg-green-500 border-green-500 text-white"
                                        : "bg-white border-gray-300 text-gray-300"
                                    }
                                `}
                      >
                        {index === 0 && <Clock size={16} />}
                        {index === 1 && <Package size={16} />}
                        {index === 2 && <Truck size={16} />}
                        {index === 3 && <CheckCircle size={16} />}
                      </div>
                      <p
                        className={`text-xs md:text-sm mt-2 font-medium ${
                          isActive ? "text-green-600" : "text-gray-400"
                        }`}
                      >
                        {label}
                      </p>
                    </div>
                  );
                }
              )}
            </div>
          </div>
        )}
      </div>

      {/* 3. Grid Layout: Thông tin & Sản phẩm */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Cột trái: Thông tin nhận hàng & Thanh toán */}
        <div className="md:col-span-1 space-y-6">
          {/* Địa chỉ */}
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="font-bold flex items-center gap-2 mb-4 text-gray-900 border-b pb-2">
              <MapPin size={18} className="text-blue-500" /> Địa chỉ nhận hàng
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-3">
                <User size={16} className="text-gray-400 mt-0.5 shrink-0" />
                <span className="font-semibold text-gray-800">
                  {order.shippingInfo?.name}
                </span>
              </div>
              <div className="flex items-start gap-3">
                <Phone size={16} className="text-gray-400 mt-0.5 shrink-0" />
                <span className="text-gray-600">
                  {order.shippingInfo?.phone}
                </span>
              </div>
              <div className="flex items-start gap-3">
                <MapPin size={16} className="text-gray-400 mt-0.5 shrink-0" />
                <span className="text-gray-600 leading-relaxed">
                  {order.shippingInfo?.address}
                </span>
              </div>
            </div>
          </div>

          {/* Thanh toán */}
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="font-bold flex items-center gap-2 mb-4 text-gray-900 border-b pb-2">
              <CreditCard size={18} className="text-blue-500" /> Thanh toán
            </h3>
            <div className="text-sm space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-500">Phương thức:</span>
                <span className="font-medium text-gray-800">
                  {order.paymentMethod === "COD"
                    ? "Tiền mặt (COD)"
                    : order.paymentMethod}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Trạng thái:</span>
                <span
                  className={`font-bold px-2 py-0.5 rounded text-xs
                    ${
                      order.paymentStatus === "Thành công" ||
                      order.paymentStatus === "Đã thanh toán"
                        ? "bg-green-100 text-green-700"
                        : "bg-orange-100 text-orange-700"
                    }
                `}
                >
                  {order.paymentStatus}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Cột phải: Danh sách sản phẩm & Tổng kết */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="font-bold flex items-center gap-2 mb-4 text-gray-900">
              <Package size={18} className="text-blue-500" /> Danh sách sản phẩm
            </h3>

            <div className="space-y-6">
              {order.items.map((item) => (
                <div key={item._id} className="flex gap-4 items-start">
                  <div className="w-20 h-24 flex-shrink-0 bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
                    <img
                      src={item.image || "/no-image.png"}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <h4 className="font-medium text-gray-900 line-clamp-2 pr-4">
                        {item.name}
                      </h4>
                      <p className="font-bold text-gray-900 text-sm">
                        {(
                          item.subtotal || item.price * item.quantity
                        ).toLocaleString()}
                        đ
                      </p>
                    </div>
                    <p className="text-sm text-gray-500 mt-1 bg-gray-50 inline-block px-2 py-0.5 rounded">
                      {item.color} - Size {item.size}
                    </p>
                    <div className="flex justify-between items-center mt-2">
                      <p className="text-sm text-gray-500">x{item.quantity}</p>

                      {/* Nút đánh giá chỉ hiện khi hoàn thành */}
                      {order.orderStatus === "Giao thành công" && (
                        <button
                          onClick={() => navigate(`/product/${item.productId}`)} // Hoặc link đến trang review
                          className="text-blue-600 text-sm hover:underline font-medium"
                        >
                          Viết đánh giá
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Phần tổng tiền */}
            <div className="border-t border-gray-100 mt-6 pt-6 space-y-3">
              <div className="flex justify-between text-gray-600 text-sm">
                <span>Tổng tiền hàng</span>
                <span>{order.subtotalPrice?.toLocaleString()}đ</span>
              </div>

              {/* Discount Logic */}
              {(order.discountCart > 0 || order.discountAmount > 0) && (
                <div className="flex justify-between text-green-600 text-sm">
                  <span>Giảm giá</span>
                  <span>
                    -
                    {(
                      (order.discountCart || 0) + (order.discountAmount || 0)
                    ).toLocaleString()}
                    đ
                  </span>
                </div>
              )}

              <div className="flex justify-between text-gray-600 text-sm">
                <span>Phí vận chuyển</span>
                <span>{(order.shippingPrice || 0).toLocaleString()}đ</span>
              </div>

              <div className="flex justify-between items-center border-t border-dashed border-gray-200 pt-4 mt-2">
                <span className="font-bold text-gray-900">Thành tiền</span>
                <span className="font-bold text-2xl text-red-600">
                  {order.totalPrice.toLocaleString()}đ
                </span>
              </div>
            </div>

            {/* Nút hủy đơn (Chỉ hiện khi chưa xác nhận hoặc mới xác nhận) */}
            {["Chờ xác nhận", "Đã xác nhận"].includes(order.orderStatus) && (
              <div className="mt-6 border-t pt-4 text-right">
                <button
                  onClick={handleCancelOrder}
                  className="inline-flex items-center gap-2 text-red-600 hover:text-white border border-red-600 hover:bg-red-600 px-5 py-2.5 rounded-lg transition-all duration-200 font-medium"
                >
                  <XCircle size={18} /> Hủy đơn hàng
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;
