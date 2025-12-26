import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  DollarSign,
  ShoppingCart,
  Package,
  Users,
  TrendingUp,
  Calendar,
} from "lucide-react";

// --- UTILS: HÀM HỖ TRỢ ---
const formatCurrency = (amount) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
  });
};

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const API_URL = `${import.meta.env.VITE_API_URL}/api`;

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");
        // Giả lập delay nhẹ để thấy hiệu ứng loading (bỏ dòng này khi chạy thật)
        // await new Promise(resolve => setTimeout(resolve, 1000));

        const { data } = await axios.get(`${API_URL}/admin/stats`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStats(data);
      } catch (error) {
        console.error("Lỗi tải thống kê", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <DashboardSkeleton />;

  // Dữ liệu mặc định để tránh lỗi nếu API trả về null/undefined
  const {
    totalRevenue = 0,
    totalOrders = 0,
    totalProducts = 0,
    totalUsers = 0,
  } = stats?.stats || {};
  const chartData = stats?.chartData || [];
  const recentOrders = stats?.recentOrders || [];

  return (
    <div className="space-y-8 p-6 bg-gray-50/50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
          Tổng quan kinh doanh
        </h2>
        <div className="text-sm text-gray-500 bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-100 flex items-center gap-2">
          <Calendar size={16} />{" "}
          {new Date().toLocaleDateString("vi-VN", { dateStyle: "full" })}
        </div>
      </div>

      {/* 1. Cards Thống kê */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Tổng doanh thu"
          value={formatCurrency(totalRevenue)}
          icon={<DollarSign className="w-6 h-6 text-emerald-600" />}
          bgIcon="bg-emerald-100"
          trend="+12.5% so với tuần trước" // Ví dụ giả lập trend
        />
        <StatCard
          title="Đơn hàng"
          value={totalOrders}
          icon={<ShoppingCart className="w-6 h-6 text-blue-600" />}
          bgIcon="bg-blue-100"
        />
        <StatCard
          title="Sản phẩm"
          value={totalProducts}
          icon={<Package className="w-6 h-6 text-purple-600" />}
          bgIcon="bg-purple-100"
        />
        <StatCard
          title="Khách hàng"
          value={totalUsers}
          icon={<Users className="w-6 h-6 text-orange-600" />}
          bgIcon="bg-orange-100"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 2. Biểu đồ Doanh thu (Chiếm 2/3) */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-gray-800">
              Doanh thu 7 ngày qua
            </h3>
            <button className="text-sm text-blue-600 hover:underline">
              Chi tiết
            </button>
          </div>

          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={chartData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#E5E7EB"
                />
                <XAxis
                  dataKey="_id"
                  tickFormatter={formatDate}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#6B7280", fontSize: 12 }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#6B7280", fontSize: 12 }}
                  tickFormatter={(val) => `${val / 1000}k`} // Rút gọn số liệu trục Y
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#3B82F6"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 3. Đơn hàng mới nhất (Chiếm 1/3) */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col">
          <h3 className="text-lg font-bold mb-4 text-gray-800">Đơn hàng mới</h3>
          <div className="flex-1 overflow-y-auto max-h-[350px] pr-2 custom-scrollbar">
            {recentOrders.length === 0 ? (
              <p className="text-center text-gray-400 py-10">
                Chưa có đơn hàng nào.
              </p>
            ) : (
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div
                    key={order._id}
                    className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-100 hover:bg-gray-100 transition"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-gray-800 text-sm">
                          #
                          {order.orderCode || order._id.slice(-6).toUpperCase()}
                        </span>
                        <span className="text-xs text-gray-500">
                          •{" "}
                          {new Date(order.createdAt).toLocaleDateString(
                            "vi-VN"
                          )}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1 truncate max-w-[120px]">
                        {order.userId?.fullName || "Khách vãng lai"}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-sm text-gray-900">
                        {formatCurrency(order.totalPrice)}
                      </p>
                      <StatusBadge status={order.paymentStatus} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <button className="w-full mt-4 py-2 text-sm font-medium text-gray-600 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
            Xem tất cả đơn hàng
          </button>
        </div>
      </div>
    </div>
  );
};

// --- SUB-COMPONENTS ---

// 1. Card thống kê đẹp hơn
const StatCard = ({ title, value, icon, bgIcon, trend }) => (
  <div className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition duration-300">
    <div className="flex items-start justify-between mb-4">
      <div>
        <p className="text-gray-500 text-sm font-medium">{title}</p>
        <h3 className="text-2xl font-bold text-gray-900 mt-1">{value}</h3>
      </div>
      <div className={`p-3 rounded-xl ${bgIcon}`}>{icon}</div>
    </div>
    {trend && (
      <div className="flex items-center text-xs font-medium text-green-600 bg-green-50 w-fit px-2 py-1 rounded">
        <TrendingUp size={14} className="mr-1" /> {trend}
      </div>
    )}
  </div>
);

// 2. Badge trạng thái đơn hàng
const StatusBadge = ({ status }) => {
  let colorClass = "bg-gray-100 text-gray-600";
  if (status === "Thành công" || status === "Đã thanh toán")
    colorClass = "bg-emerald-100 text-emerald-700";
  if (status === "Đang xử lý" || status === "Chờ thanh toán")
    colorClass = "bg-amber-100 text-amber-700";
  if (status === "Hủy" || status === "Thất bại")
    colorClass = "bg-red-100 text-red-700";

  return (
    <span
      className={`inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide ${colorClass}`}
    >
      {status}
    </span>
  );
};

// 3. Custom Tooltip cho Chart
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-900 text-white p-3 rounded-lg shadow-xl text-xs">
        <p className="font-bold mb-1">{formatDate(label)}</p>
        <p className="text-blue-200">
          Doanh thu:{" "}
          <span className="text-white font-bold text-sm ml-1">
            {formatCurrency(payload[0].value)}
          </span>
        </p>
      </div>
    );
  }
  return null;
};

// 4. Skeleton Loader (Hiệu ứng đang tải)
const DashboardSkeleton = () => (
  <div className="p-6 space-y-8 bg-gray-50 min-h-screen">
    <div className="h-8 bg-gray-200 rounded w-48 animate-pulse mb-6"></div>
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {[...Array(4)].map((_, i) => (
        <div
          key={i}
          className="h-32 bg-gray-200 rounded-2xl animate-pulse"
        ></div>
      ))}
    </div>
    <div className="grid grid-cols-3 gap-8 h-[400px]">
      <div className="col-span-2 bg-gray-200 rounded-2xl animate-pulse"></div>
      <div className="bg-gray-200 rounded-2xl animate-pulse"></div>
    </div>
  </div>
);

export default Dashboard;
