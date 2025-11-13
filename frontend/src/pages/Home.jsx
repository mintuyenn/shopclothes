// src/pages/Home.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSearchParams } from "react-router-dom";
import * as Motion from "framer-motion";

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

  // Fetch sản phẩm mới nhất
  useEffect(() => {
    const fetchLatestProducts = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5001/api/products/latest"
        );
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

  // Fetch tất cả sản phẩm
  const fetchProducts = async () => {
    setLoadingAll(true);
    try {
      const res = await axios.get("http://localhost:5001/api/products", {
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

  // Update query param
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
    { label: "DƯỚI 100.000Đ", min: 0, max: 100000 },
    { label: "100.000 - 200.000Đ", min: 100000, max: 200000 },
    { label: "200.000 - 300.000Đ", min: 200000, max: 300000 },
    { label: "TRÊN 300.000Đ", min: 300000, max: "" },
  ];

  // Framer Motion variants
  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.1 } },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" },
    },
  };

  return (
    <div className="pt-20 bg-blue-50 min-h-screen">
      {/* Marquee */}
      <div className="bg-blue-600 text-white rounded-t-lg">
        <MarqueeText duration={18}>
          🚚 GIAO HÀNG TOÀN QUỐC &nbsp;&nbsp;&nbsp; ✅ HÀNG CHÍNH HÃNG
          &nbsp;&nbsp;&nbsp; 🎁 ƯU ĐÃI CHO NGƯỜI MỚI
        </MarqueeText>
      </div>

      {/* Banner */}
      <Banner />

      {/* Sản phẩm nổi bật */}
      <div className="px-6 md:px-12 mt-10">
        <h2 className="text-4xl md:text-5xl font-extrabold text-red-600 mb-2 text-center uppercase">
          🌟 SẢN PHẨM NỔI BẬT 🌟
        </h2>
        <p className="text-center text-blue-700 text-lg md:text-xl font-semibold mb-8">
          Khám phá những sản phẩm mới nhất với ưu đãi hấp dẫn dành cho bạn! 🎁
        </p>

        {loadingHot ? (
          <div className="text-center text-gray-500">Đang tải sản phẩm...</div>
        ) : latestProducts.length === 0 ? (
          <div className="text-center text-gray-500">Không có sản phẩm.</div>
        ) : (
          <Motion.motion.div
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {latestProducts.map((p) => (
              <Motion.motion.div key={p._id} variants={cardVariants}>
                <ProductCard product={p} />
              </Motion.motion.div>
            ))}
          </Motion.motion.div>
        )}
      </div>

      {/* Tất cả sản phẩm */}
      <div className="px-6 md:px-12 mt-12">
        <h2 className="text-4xl md:text-5xl font-extrabold text-red-600 mb-2 text-center uppercase">
          🔥GIAN HÀNG SẢN PHẨM 🔥
        </h2>
        <p className="text-center text-blue-700 text-lg md:text-xl font-semibold mb-6">
          Lựa chọn sản phẩm yêu thích và mua ngay hôm nay để nhận ưu đãi! 🛒
        </p>

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

        {loadingAll ? (
          <div className="text-center text-gray-500">Đang tải sản phẩm...</div>
        ) : products.length === 0 ? (
          <div className="text-center text-gray-500">Không có sản phẩm.</div>
        ) : (
          <Motion.motion.div
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {products.map((p) => {
              const activeVariant =
                p.variants?.find((v) => v.color === color) || p.variants?.[0];
              return (
                <Motion.motion.div key={p._id} variants={cardVariants}>
                  <ProductCard product={p} activeVariant={activeVariant} />
                </Motion.motion.div>
              );
            })}
          </Motion.motion.div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-6 gap-2">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => updateQuery({ page: i + 1 })}
                className={`px-3 py-1 rounded font-medium transition-colors ${
                  page === i + 1
                    ? "bg-red-500 text-white shadow-lg"
                    : "bg-white border text-gray-700 hover:bg-red-50"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
