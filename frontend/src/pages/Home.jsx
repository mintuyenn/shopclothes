// src/pages/Home.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSearchParams } from "react-router-dom";
import * as Motion from "framer-motion";
import { ShoppingBag, Eye, ArrowRight } from "lucide-react"; // Gợi ý: Cài thêm lucide-react nếu chưa có, hoặc dùng icon text

import ProductCard from "../components/ProductCard";
import Banner from "../components/Banner";
import MarqueeText from "../components/MarqueeText";
import FilterBar from "../components/FilterBar";

const Home = () => {
  const [latestProducts, setLatestProducts] = useState([]);
  const [loadingHot, setLoadingHot] = useState(true);

  const [products, setProducts] = useState([]);
  const [loadingAll, setLoadingAll] = useState(true);
  const [colors, setColors] = useState([]);
  const [totalPages, setTotalPages] = useState(1);

  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;
  const limit = 12;
  const minPrice = searchParams.get("minPrice") || "";
  const maxPrice = searchParams.get("maxPrice") || "";
  const color = searchParams.get("color") || "";
  const sort = searchParams.get("sort") || "";

  const [selectedPrice, setSelectedPrice] = useState("TẤT CẢ");
  const [selectedColor, setSelectedColor] = useState("TẤT CẢ");
  const API_URL = `${import.meta.env.VITE_API_URL}/api`;

  // --- LOGIC GIỮ NGUYÊN ---
  useEffect(() => {
    const fetchLatestProducts = async () => {
      try {
        const res = await axios.get(`${API_URL}/products/latest`);
        setLatestProducts(res.data || []);
      } catch (err) {
        console.error("Lỗi khi tải sản phẩm mới:", err);
        setLatestProducts([]);
      } finally {
        setLoadingHot(false);
      }
    };
    fetchLatestProducts();
  }, []);

  const fetchProducts = async () => {
    setLoadingAll(true);
    try {
      const res = await axios.get(`${API_URL}/products`, {
        params: { page, limit, minPrice, maxPrice, color, sort },
      });
      const data = res.data.data || [];
      setTotalPages(res.data.totalPages || 1);
      setProducts(data);

      const allColors = new Set();
      data.forEach((p) => {
        if (p.variants) p.variants.forEach((v) => allColors.add(v.color));
      });
      setColors([...allColors]);
    } catch (err) {
      console.error("Lỗi khi tải sản phẩm:", err);
      setProducts([]);
    } finally {
      setLoadingAll(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [page, minPrice, maxPrice, color, sort]);

  const updateQuery = (params, labelSetter, labelValue) => {
    const newParams = { page, minPrice, maxPrice, color, sort, ...params };
    Object.keys(newParams).forEach(
      (key) =>
        (newParams[key] === "" ||
          newParams[key] === undefined ||
          newParams[key] === 1) &&
        delete newParams[key]
    );
    setSearchParams(newParams);
    if (labelSetter) labelSetter(labelValue);
  };

  const priceRanges = [
    { label: "TẤT CẢ", min: "", max: "" },
    { label: "DƯỚI 100K", min: 0, max: 100000 },
    { label: "100K - 200K", min: 100000, max: 200000 },
    { label: "200K - 300K", min: 200000, max: 300000 },
    { label: "TRÊN 300K", min: 300000, max: "" },
  ];

  // --- FRAMER MOTION VARIANTS ---
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 pt-[70px]">
      {/* 1. Marquee - Minimalist Black */}
      <div className="bg-gray-900 text-white py-2.5 overflow-hidden">
        <MarqueeText duration={30}>
          <span className="mx-8 text-xs md:text-sm font-medium tracking-widest uppercase">
            Miễn phí vận chuyển đơn từ 500k
          </span>
          <span className="mx-8 text-xs md:text-sm font-medium tracking-widest uppercase">
            Đổi trả trong vòng 30 ngày
          </span>
          <span className="mx-8 text-xs md:text-sm font-medium tracking-widest uppercase">
            Hàng chính hãng 100%
          </span>
        </MarqueeText>
      </div>

      {/* 2. Banner */}
      <Banner />

      {/* 3. Section: New Arrivals (Nền Trắng) */}
      <section className="py-16 md:py-24 px-4 bg-white">
        <div className="max-w-screen-xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 uppercase tracking-tight mb-3">
              New Arrivals
            </h2>
            <p className="text-gray-500 text-sm md:text-base max-w-xl mx-auto">
              Cập nhật xu hướng thời trang mới nhất. Phong cách tối giản, tinh
              tế cho mọi dịp.
            </p>
          </div>

          {/* Grid Content */}
          {loadingHot ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
            </div>
          ) : latestProducts.length === 0 ? (
            <div className="text-center text-gray-400 py-10 italic">
              Đang cập nhật sản phẩm mới...
            </div>
          ) : (
            <Motion.motion.div
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-4 gap-y-8 md:gap-x-6 md:gap-y-10"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
            >
              {latestProducts.map((p) => (
                <Motion.motion.div
                  key={p._id}
                  variants={cardVariants}
                  className="group relative"
                >
                  {/* Card Wrapper với Style cao cấp */}
                  <div className="bg-white rounded-2xl overflow-hidden transition-all duration-300 group-hover:shadow-xl border border-transparent group-hover:border-gray-100">
                    <ProductCard product={p} />

                    {/* Overlay Action Buttons (Giả lập hiệu ứng hover thêm) */}
                    <div className="absolute inset-x-0 bottom-20 px-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden md:flex justify-center gap-2 pointer-events-none">
                      {/* Note: pointer-events-none để tránh lỗi click nếu ProductCard chiếm hết chỗ, 
                          nếu bạn muốn nút bấm được hãy dùng z-index cao hơn và pointer-events-auto */}
                    </div>
                  </div>
                </Motion.motion.div>
              ))}
            </Motion.motion.div>
          )}
        </div>
      </section>

      {/* 5. NEW SECTION: PROMO BANNER (Phá vỡ layout nhàm chán) */}
      <section className="py-24 bg-black text-white overflow-hidden relative">
        <div className="absolute inset-0 opacity-30">
          <img
            src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=2574&auto=format&fit=crop"
            className="w-full h-full object-cover"
            alt="Background"
          />
        </div>
        <div className="max-w-screen-xl mx-auto px-4 relative z-10 text-center">
          <Motion.motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block border border-white/30 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-[0.2em] mb-6">
              Limited Edition
            </span>
            <h2 className="text-4xl md:text-7xl font-black uppercase mb-6 tracking-tighter">
              Summer Sale <span className="text-red-600">50%</span>
            </h2>
            <p className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto mb-10 font-light">
              Cơ hội sở hữu những thiết kế đẳng cấp với mức giá ưu đãi nhất năm.
              Thời gian có hạn.
            </p>
            <button
              onClick={() => {
                document
                  .getElementById("shop-collection")
                  .scrollIntoView({ behavior: "smooth" });
              }}
              className="bg-white text-black px-10 py-4 rounded-full font-bold uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all duration-300 shadow-xl"
            >
              Khám phá ngay
            </button>
          </Motion.motion.div>
        </div>
      </section>

      {/* 4. Section: Shop / Gian Hàng (Nền Xám Nhạt để phân tách) */}
      <section className="py-16 md:py-24 px-4 bg-gray-50 border-t border-gray-100">
        <div className="max-w-screen-xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end md:items-center mb-8 gap-4">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 uppercase tracking-tight mb-2">
                Shop Collection
              </h2>
              <p className="text-gray-500 text-sm">
                Khám phá tất cả sản phẩm ưu đãi.
              </p>
            </div>
            {/* Filter Bar */}
            <div className="w-full md:w-auto">
              <FilterBar
                selectedPrice={selectedPrice}
                setSelectedPrice={setSelectedPrice}
                selectedColor={selectedColor}
                setSelectedColor={setSelectedColor}
                sort={sort}
                updateQuery={updateQuery}
                colors={colors}
                priceRanges={priceRanges}
              />
            </div>
          </div>

          {/* Product Grid */}
          {loadingAll ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
            </div>
          ) : products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl shadow-sm border border-gray-100">
              <p className="text-gray-500 text-lg">
                Không tìm thấy sản phẩm phù hợp.
              </p>
              <button
                onClick={() =>
                  updateQuery({
                    page: 1,
                    minPrice: "",
                    maxPrice: "",
                    color: "",
                    sort: "",
                  })
                }
                className="mt-4 px-6 py-2 bg-gray-900 text-white text-sm font-medium rounded-full hover:bg-gray-700 transition"
              >
                Xóa bộ lọc
              </button>
            </div>
          ) : (
            <Motion.motion.div
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-4 gap-y-8 md:gap-x-6 md:gap-y-10"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
            >
              {products.map((p) => {
                const activeVariant =
                  p.variants?.find((v) => v.color === color) || p.variants?.[0];
                return (
                  <Motion.motion.div
                    key={p._id}
                    variants={cardVariants}
                    className="group"
                  >
                    <div className="bg-white rounded-2xl overflow-hidden transition-all duration-500 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:-translate-y-1 h-full flex flex-col">
                      {/* Wrapper ProductCard để đảm bảo style */}
                      <div className="relative flex-grow">
                        <ProductCard
                          product={p}
                          activeVariant={activeVariant}
                        />

                        {/* Hover Overlay Desktop: Quick Action */}
                        <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-4 group-hover:translate-x-0">
                          <button
                            className="bg-white p-2 rounded-full shadow-md hover:bg-black hover:text-white transition-colors"
                            title="Xem nhanh"
                          >
                            <Eye size={18} />
                          </button>
                          <button
                            className="bg-white p-2 rounded-full shadow-md hover:bg-rose-600 hover:text-white transition-colors"
                            title="Thêm vào giỏ"
                          >
                            <ShoppingBag size={18} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </Motion.motion.div>
                );
              })}
            </Motion.motion.div>
          )}

          {/* Pagination - Modern Style */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-16 gap-2">
              {Array.from({ length: totalPages }, (_, i) => {
                const pageNum = i + 1;
                const isActive = page === pageNum;
                return (
                  <button
                    key={pageNum}
                    onClick={() => updateQuery({ page: pageNum })}
                    className={`w-10 h-10 flex items-center justify-center rounded-lg font-semibold text-sm transition-all duration-200 ${
                      isActive
                        ? "bg-gray-900 text-white shadow-lg scale-110"
                        : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-100 hover:border-gray-300"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              {page < totalPages && (
                <button
                  onClick={() => updateQuery({ page: page + 1 })}
                  className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-200 bg-white hover:bg-gray-100 transition-colors"
                >
                  <ArrowRight size={16} />
                </button>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
