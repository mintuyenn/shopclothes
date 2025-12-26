import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  Package,
  ChevronRight,
  Calendar,
  CreditCard,
  ShoppingBag,
  Truck,
} from "lucide-react";

// Helper: Xác định màu sắc cho trạng thái đơn hàng
const getStatusStyle = (status) => {
  switch (status) {
    case "Giao thành công":
      return "bg-green-100 text-green-700 border-green-200";
    case "Đang giao":
    case "Đang vận chuyển":
      return "bg-blue-100 text-blue-700 border-blue-200";
    case "Đã hủy":
      return "bg-red-100 text-red-700 border-red-200";
    case "Chờ xác nhận":
    default:
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
  }
};

const OrderHistoryPage = () => {
  const { token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const API_URL = `${import.meta.env.VITE_API_URL}/api`;

  useEffect(() => {
    const fetchOrders = async () => {
      if (!token) return;
      try {
        // Giả lập delay nhẹ để thấy loading skeleton (có thể bỏ)
        // await new Promise(resolve => setTimeout(resolve, 500));

        const res = await axios.get(`${API_URL}/orders/my-orders`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        // Sắp xếp đơn mới nhất lên đầu
        const sortedOrders = (res.data.data || []).sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setOrders(sortedOrders);
      } catch (err) {
        console.error(err);
        toast.error("Không thể tải lịch sử mua hàng");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [token]);

  // --- RENDER LOADING (Skeleton) ---
  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-6">
        <div className="h-10 w-48 bg-gray-200 rounded animate-pulse mx-auto mb-8"></div>
        {[1, 2].map((i) => (
          <div
            key={i}
            className="border border-gray-200 rounded-xl p-6 space-y-4 animate-pulse"
          >
            <div className="flex justify-between">
              <div className="h-6 w-32 bg-gray-200 rounded"></div>
              <div className="h-6 w-24 bg-gray-200 rounded"></div>
            </div>
            <div className="h-20 bg-gray-100 rounded"></div>
            <div className="flex justify-between pt-4">
              <div className="h-6 w-20 bg-gray-200 rounded"></div>
              <div className="h-10 w-32 bg-gray-200 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // --- RENDER EMPTY STATE ---
  if (!orders.length) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="bg-gray-50 p-6 rounded-full mb-4">
          <ShoppingBag size={48} className="text-gray-400" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Chưa có đơn hàng nào
        </h2>
        <p className="text-gray-500 mb-6 max-w-md">
          Hãy khám phá bộ sưu tập mới nhất của chúng tôi và đặt hàng ngay hôm
          nay.
        </p>
        <button
          onClick={() => navigate("/")}
          className="bg-black text-white px-8 py-3 rounded-full font-medium hover:bg-gray-800 transition shadow-lg hover:shadow-xl"
        >
          Bắt đầu mua sắm
        </button>
      </div>
    );
  }

  // --- MAIN CONTENT ---
  return (
    <div className="min-h-screen bg-gray-50/50 py-10">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header Title */}
        <div className="flex items-center gap-3 mb-8">
          <Package className="w-8 h-8 text-black" />
          <h1 className="text-3xl font-black uppercase tracking-tight text-gray-900">
            Lịch sử đơn hàng
          </h1>
        </div>

        <div className="space-y-6">
          {orders.map((order) => {
            const displayItems = order.items.slice(0, 2);
            const remainingItems = order.items.length - 2;

            return (
              <div
                key={order._id}
                onClick={() => navigate(`/order-detail/${order._id}`)}
                className="bg-white border border-gray-100 rounded-2xl p-5 md:p-6 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer group"
              >
                {/* 1. Order Header Info */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 pb-4 mb-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-lg text-gray-900">
                        #{order.orderCode || order._id.slice(-6).toUpperCase()}
                      </span>
                      <span
                        className={`px-3 py-0.5 rounded-full text-xs font-bold border uppercase tracking-wide ${getStatusStyle(
                          order.orderStatus
                        )}`}
                      >
                        {order.orderStatus}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Calendar size={14} />
                        {new Date(order.createdAt).toLocaleDateString("vi-VN", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                      <div className="hidden md:flex items-center gap-1 border-l pl-4 border-gray-200">
                        <CreditCard size={14} />
                        {order.paymentMethod === "COD"
                          ? "Thanh toán khi nhận"
                          : "Chuyển khoản/Ví"}
                      </div>
                    </div>
                  </div>

                  {/* Total Price (Mobile: Left, Desktop: Right) */}
                  <div className="text-left md:text-right">
                    <p className="text-xs text-gray-500 uppercase font-medium">
                      Tổng tiền
                    </p>
                    <p className="text-xl font-bold text-red-600">
                      {order.totalPrice.toLocaleString()}đ
                    </p>
                  </div>
                </div>

                {/* 2. Product List Preview */}
                <div className="space-y-4">
                  {displayItems.map((item) => (
                    <div key={item._id} className="flex gap-4 items-center">
                      <div className="w-16 h-20 flex-shrink-0 bg-gray-100 rounded-md overflow-hidden border border-gray-200">
                        <img
                          src={item.image || "/placeholder.png"}
                          alt={item.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 line-clamp-1 group-hover:text-blue-600 transition-colors">
                          {item.name}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          {item.color} / Size {item.size}{" "}
                          <span className="mx-1">•</span> x{item.quantity}
                        </p>
                      </div>
                      <div className="text-sm font-medium text-gray-900">
                        {(
                          item.price || item.subtotal / item.quantity
                        ).toLocaleString()}
                        đ
                      </div>
                    </div>
                  ))}

                  {/* Indicator for more items */}
                  {remainingItems > 0 && (
                    <div className="text-center py-2 bg-gray-50 rounded-lg text-sm text-gray-500 font-medium">
                      + {remainingItems} sản phẩm khác
                    </div>
                  )}
                </div>

                {/* 3. Footer Actions */}
                <div className="mt-6 pt-4 border-t border-gray-100 flex justify-between items-center">
                  <div className="flex items-center text-sm text-gray-500">
                    <Truck size={16} className="mr-2 text-blue-500" />
                    <span className="truncate max-w-[150px] md:max-w-none">
                      {order.orderStatus === "Đã hoàn thành"
                        ? "Đã giao hàng thành công"
                        : "Đang vận chuyển hàng đến bạn"}
                    </span>
                  </div>

                  <button className="flex items-center gap-1 text-sm font-bold text-black border border-black rounded-full px-5 py-2 hover:bg-black hover:text-white transition-all">
                    Chi tiết <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default OrderHistoryPage;
