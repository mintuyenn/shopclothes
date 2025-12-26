import React from "react";
import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  ShoppingBag,
  Users,
  Package,
  LogOut,
  Tag,
  Store,
} from "lucide-react";

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const menuItems = [
    {
      path: "/admin/dashboard",
      icon: <LayoutDashboard size={20} />,
      label: "Tổng quan",
    },
    {
      path: "/admin/products",
      icon: <ShoppingBag size={20} />,
      label: "Sản phẩm",
    },
    {
      path: "/admin/orders",
      icon: <Package size={20} />,
      label: "Đơn hàng",
    },
    {
      path: "/admin/users",
      icon: <Users size={20} />,
      label: "Khách hàng",
    },
    {
      path: "/admin/discounts",
      icon: <Tag size={20} />,
      label: "Mã giảm giá",
    },
  ];

  return (
    <div className="flex h-screen bg-gray-50 font-sans text-gray-900">
      {/* Sidebar */}
      <aside className="w-72 bg-white border-r border-gray-200 flex flex-col shadow-sm z-10 hidden md:flex">
        {/* Logo Area */}
        <div className="h-20 flex items-center px-8 border-b border-gray-100">
          <div className="flex items-center gap-3 text-blue-600">
            <div className="p-2 bg-blue-600 rounded-lg">
              <Store className="text-white" size={24} />
            </div>
            <span className="text-xl font-bold tracking-tight text-gray-900">
              Admin<span className="text-blue-600">Panel</span>
            </span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-6 px-4 space-y-1 overflow-y-auto">
          <p className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
            Menu chính
          </p>
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 group font-medium ${
                  isActive
                    ? "bg-blue-50 text-blue-600 shadow-sm"
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <span
                  className={
                    isActive
                      ? "text-blue-600"
                      : "text-gray-400 group-hover:text-gray-600"
                  }
                >
                  {item.icon}
                </span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* User Info & Logout */}
        <div className="p-4 border-t border-gray-100">
          <div className="bg-gray-50 rounded-xl p-4 mb-3 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
              AD
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-bold text-gray-900 truncate">
                Admin User
              </p>
              <p className="text-xs text-gray-500 truncate">
                admin@example.com
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 w-full px-4 py-3 text-sm font-medium text-red-600 bg-white border border-red-100 hover:bg-red-50 rounded-xl transition-colors"
          >
            <LogOut size={18} /> Đăng xuất
          </button>
        </div>
      </aside>

      {/* Main Content Wrapper */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Nếu bạn muốn thêm Header chung (Search, Notification) thì đặt ở đây */}

        {/* Nội dung trang con (Dashboard, Products, etc.) */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
