// src/pages/ProductPage.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSearchParams } from "react-router-dom";
import * as Motion from "framer-motion";
import ProductCard from "../components/ProductCard";
import FilterBar from "../components/FilterBar";
import { ShoppingCart } from "lucide-react";

const ProductPage = () => {
  const [products, setProducts] = useState([]);
  const [loadingAll, setLoadingAll] = useState(true);
  const [colors, setColors] = useState([]);
  const [selectedPrice, setSelectedPrice] = useState("Tất cả");
  const [selectedColor, setSelectedColor] = useState("Tất cả");
  const [toast, setToast] = useState(null);

  const [searchParams, setSearchParams] = useSearchParams();
  const minPrice = searchParams.get("minPrice") || "";
  const maxPrice = searchParams.get("maxPrice") || "";
  const color = searchParams.get("color") || "";
  const sort = searchParams.get("sort") || "";

  const priceRanges = [
    { label: "Dưới 100.000đ", min: 0, max: 100000 },
    { label: "Từ 100.000 - 200.000đ", min: 100000, max: 200000 },
    { label: "Từ 200.000 - 300.000đ", min: 200000, max: 300000 },
    { label: "Trên 300.000đ", min: 300000, max: "" },
  ];

  const showToast = (text, type = "success") => {
    setToast({ text, type });
    setTimeout(() => setToast(null), 2000);
  };

  const fetchProducts = async () => {
    setLoadingAll(true);
    try {
      const res = await axios.get("http://localhost:5001/api/products", {
        params: { limit: 9999, minPrice, maxPrice, color, sort },
      });
      const data = res.data.data || [];
      setProducts(data);

      const allColors = new Set();
      data.forEach((p) => p.variants?.forEach((v) => allColors.add(v.color)));
      setColors([...allColors]);
    } catch (err) {
      console.error("Lỗi tải sản phẩm:", err);
      setProducts([]);
    } finally {
      setLoadingAll(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [minPrice, maxPrice, color, sort]);

  const updateQuery = (params, labelSetter, labelValue) => {
    const newParams = { minPrice, maxPrice, color, sort, ...params };
    Object.keys(newParams).forEach(
      (key) =>
        (newParams[key] === "" || newParams[key] === undefined) &&
        delete newParams[key]
    );
    setSearchParams(newParams);
    if (labelSetter) labelSetter(labelValue);
  };

  // --- Motion Variants ---
  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.1 } },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
    hover: { scale: 1.03, boxShadow: "0px 20px 40px rgba(0,0,0,0.15)" },
  };

  return (
    <div className="pt-20 bg-yellow-50 min-h-screen">
      {/* Toast */}
      {toast && (
        <div
          className="fixed top-5 right-5 px-4 py-3 rounded-xl shadow-lg flex items-center gap-2 z-50 animate-slide transition-opacity duration-500"
          style={{
            backgroundColor: toast.type === "success" ? "#1abc9c" : "#e74c3c",
          }}
        >
          <ShoppingCart size={18} color="#fff" />
          <span className="text-sm font-medium text-white">{toast.text}</span>
        </div>
      )}

      <div className="px-6 md:px-12 mt-10">
        {/* Header */}
        <Motion.motion.div
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-8"
        >
          <h2 className="text-4xl md:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-pink-700 mb-2 animate-pulse">
            GIAN HÀNG SẢN PHẨM
          </h2>
          <p className="text-blue-600 text-lg md:text-xl font-semibold max-w-xl mx-auto">
            Mua ngay hôm nay để nhận nhiều ưu đãi hấp dẫn! 🎁
          </p>
        </Motion.motion.div>

        {/* FilterBar */}
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

        {/* Products Grid */}
        {loadingAll ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 animate-pulse mt-6">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="bg-gray-200 h-64 rounded-lg"></div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center text-gray-500 mt-10">
            Không có sản phẩm.
          </div>
        ) : (
          <Motion.motion.div
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mt-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {products.map((p) => {
              const activeVariant =
                p.variants?.find((v) => v.color === color) || p.variants?.[0];
              return (
                <Motion.motion.div
                  key={p._id}
                  variants={cardVariants}
                  whileHover="hover"
                >
                  <ProductCard
                    product={p}
                    activeVariant={activeVariant}
                    showToast={showToast}
                  />
                </Motion.motion.div>
              );
            })}
          </Motion.motion.div>
        )}
      </div>
    </div>
  );
};

export default ProductPage;
