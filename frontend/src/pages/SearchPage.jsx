// src/pages/SearchPage.jsx
import React, { useEffect, useState, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Search,
  ArrowRight,
  SlidersHorizontal,
  ChevronDown,
} from "lucide-react";
import * as Motion from "framer-motion";
import ProductCard from "../components/ProductCard";

const SearchPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Lấy keyword từ URL
  const queryParams = new URLSearchParams(location.search);
  const initialQuery = queryParams.get("q") || "";

  // State
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortOption, setSortOption] = useState("default"); // default, price-asc, price-desc
  const [localSearch, setLocalSearch] = useState(initialQuery); // Ô input search tại trang này
  const API_URL = `${import.meta.env.VITE_API_URL}/api`;

  // --- Animation Variants ---
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  // --- 1. Fetch Data ---
  useEffect(() => {
    const fetchProducts = async () => {
      if (!initialQuery) return;
      try {
        setLoading(true);
        const res = await axios.get(
          `${API_URL}/products/search?q=${encodeURIComponent(
            initialQuery
          )}`
        );
        setProducts(res.data.data || []);
        setLocalSearch(initialQuery); // Sync input với URL
      } catch (err) {
        console.error("Lỗi khi tìm kiếm:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [initialQuery]);

  // --- 2. Xử lý Sắp xếp (Client-side Sort) ---
  const sortedProducts = useMemo(() => {
    let sorted = [...products];
    if (sortOption === "price-asc") {
      sorted.sort(
        (a, b) => (a.finalPrice || a.price) - (b.finalPrice || b.price)
      );
    } else if (sortOption === "price-desc") {
      sorted.sort(
        (a, b) => (b.finalPrice || b.price) - (a.finalPrice || a.price)
      );
    }
    // Mặc định giữ nguyên thứ tự API trả về (độ liên quan)
    return sorted;
  }, [products, sortOption]);

  // --- 3. Xử lý Search lại ngay tại trang ---
  const handleLocalSearch = (e) => {
    e.preventDefault();
    if (localSearch.trim()) {
      navigate(`/search?q=${encodeURIComponent(localSearch.trim())}`);
    }
  };

  // --- Loading View ---
  if (loading) {
    return (
      <div className="min-h-screen bg-white pt-[120px] flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-4 border-gray-200 border-t-black rounded-full animate-spin mb-4"></div>
        <p className="text-gray-500 font-medium">Đang tìm kiếm sản phẩm...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-[120px] pb-20 px-4 md:px-8 font-sans text-gray-900">
      <div className="max-w-screen-xl mx-auto">
        {/* --- HEADER SECTION: Đã chỉnh sửa để lấp đầy khoảng trống --- */}
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-gray-100 pb-6 mb-8 gap-6">
          {/* TRÁI: Tiêu đề & Kết quả */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-black text-white text-[10px] font-bold px-2 py-1 rounded-sm uppercase tracking-wider">
                Kết quả tìm kiếm
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-2">
              "{initialQuery}"
            </h1>
            <p className="text-gray-500 text-sm">
              Tìm thấy <strong className="text-black">{products.length}</strong>{" "}
              sản phẩm phù hợp
            </p>
          </div>

          {/* PHẢI: Công cụ (Search box + Sort) - Lấp khoảng trống */}
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            {/* 1. Quick Search Box */}
            <form
              onSubmit={handleLocalSearch}
              className="relative group w-full sm:w-64"
            >
              <input
                type="text"
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                placeholder="Tìm kiếm khác..."
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-black focus:bg-white transition-all"
              />
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 group-focus-within:text-black transition-colors" />
            </form>

            {/* 2. Sort Dropdown */}
            <div className="relative min-w-[180px]">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <SlidersHorizontal className="w-4 h-4 text-gray-500" />
              </div>
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="w-full appearance-none bg-white border border-gray-200 text-gray-700 py-2.5 pl-10 pr-8 rounded-lg text-sm font-medium focus:outline-none focus:border-black focus:ring-1 focus:ring-black cursor-pointer hover:border-gray-400 transition-colors"
              >
                <option value="default">Liên quan nhất</option>
                <option value="price-asc">Giá: Thấp đến Cao</option>
                <option value="price-desc">Giá: Cao đến Thấp</option>
              </select>
              <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </div>
            </div>
          </div>
        </div>

        {/* --- NỘI DUNG CHÍNH (GRID) --- */}
        {products.length === 0 ? (
          // Empty State
          <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in-up">
            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6">
              <Search className="w-10 h-10 text-gray-300" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Không tìm thấy kết quả nào
            </h2>
            <p className="text-gray-500 max-w-md mx-auto mb-8">
              Thử sử dụng từ khóa chung chung hơn hoặc kiểm tra lại lỗi chính
              tả.
            </p>
            <button
              onClick={() => navigate("/")}
              className="group flex items-center gap-2 px-8 py-3 bg-black text-white rounded-lg font-bold hover:bg-red-600 transition-all duration-300 shadow-lg hover:shadow-red-500/30"
            >
              Về trang chủ
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        ) : (
          // Product Grid
          <Motion.motion.div
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-6 gap-y-10"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {sortedProducts.map((product) => (
              <Motion.motion.div key={product._id} variants={itemVariants}>
                <ProductCard product={product} />
              </Motion.motion.div>
            ))}
          </Motion.motion.div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
