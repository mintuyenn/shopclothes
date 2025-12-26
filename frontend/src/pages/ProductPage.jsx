import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSearchParams } from "react-router-dom";
import { Filter, X, SlidersHorizontal, ChevronDown } from "lucide-react";
import ProductCard from "../components/ProductCard";

const ProductPage = () => {
  // --- URL Params ---
  const [searchParams, setSearchParams] = useSearchParams();
  const minPrice = searchParams.get("minPrice") || "";
  const maxPrice = searchParams.get("maxPrice") || "";
  const color = searchParams.get("color") || "";
  const sort = searchParams.get("sort") || "newest";
  const API_URL = `${import.meta.env.VITE_API_URL}/api`;

  // --- State ---
  const [products, setProducts] = useState([]);
  const [availableColors, setAvailableColors] = useState([]); // Danh sách màu lấy từ API
  const [loading, setLoading] = useState(true);
  const [showMobileFilter, setShowMobileFilter] = useState(false);

  // Local state cho input giá (để nhập xong mới bấm Áp dụng)
  const [priceRange, setPriceRange] = useState({
    min: minPrice,
    max: maxPrice,
  });

  // --- Helpers ---
  const updateQuery = (newParams) => {
    const currentParams = Object.fromEntries(searchParams.entries());
    const mergedParams = { ...currentParams, ...newParams };

    // Xóa key rỗng
    Object.keys(mergedParams).forEach((key) => {
      if (!mergedParams[key]) delete mergedParams[key];
    });

    setSearchParams(mergedParams);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleApplyPrice = () => {
    updateQuery({ minPrice: priceRange.min, maxPrice: priceRange.max });
    setShowMobileFilter(false);
  };

  const clearAllFilters = () => {
    setPriceRange({ min: "", max: "" });
    setSearchParams({}); // Xóa hết params
  };

  // --- Fetch Data ---
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        // Fetch products với filter hiện tại
        const res = await axios.get(`${API_URL}/products`, {
          params: { limit: 100, minPrice, maxPrice, color, sort },
        });
        const data = res.data.data || [];
        setProducts(data);

        // Logic: Lấy toàn bộ màu sắc có sẵn từ danh sách sản phẩm tải về
        // (Hoặc tốt hơn là gọi 1 API riêng lấy list colors nếu backend hỗ trợ)
        const colorsSet = new Set();
        data.forEach((p) => p.variants?.forEach((v) => colorsSet.add(v.color)));
        setAvailableColors(Array.from(colorsSet).sort());
      } catch (err) {
        console.error("Lỗi tải sản phẩm:", err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
    // Sync lại input giá khi URL thay đổi (trường hợp user back/forward browser)
    setPriceRange({ min: minPrice, max: maxPrice });
  }, [minPrice, maxPrice, color, sort]);

  // --- Component con: Sidebar Content (Tái sử dụng cho cả Desktop & Mobile) ---
  const FilterContent = () => (
    <div className="space-y-8">
      {/* 1. Sort */}
      <div>
        <h3 className="text-sm font-bold uppercase tracking-wider mb-4 text-gray-900">
          Sắp xếp
        </h3>
        <div className="space-y-3">
          {[
            { label: "Mới nhất", value: "newest" },
            { label: "Giá tăng dần", value: "price_asc" },
            { label: "Giá giảm dần", value: "price_desc" },
          ].map((opt) => (
            <label
              key={opt.value}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <div
                className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                  sort === opt.value ? "border-red-600" : "border-gray-300"
                }`}
              >
                {sort === opt.value && (
                  <div className="w-2 h-2 bg-red-600 rounded-full" />
                )}
              </div>
              <input
                type="radio"
                name="sort"
                className="hidden"
                checked={sort === opt.value}
                onChange={() => updateQuery({ sort: opt.value })}
              />
              <span
                className={`text-sm ${
                  sort === opt.value
                    ? "font-bold text-gray-900"
                    : "text-gray-600 group-hover:text-black"
                }`}
              >
                {opt.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      <hr className="border-gray-100" />

      {/* 2. Price Range */}
      <div>
        <h3 className="text-sm font-bold uppercase tracking-wider mb-4 text-gray-900">
          Khoảng giá
        </h3>
        <div className="flex items-center gap-2 mb-3">
          <input
            type="number"
            placeholder="Min"
            value={priceRange.min}
            onChange={(e) =>
              setPriceRange({ ...priceRange, min: e.target.value })
            }
            className="w-full p-2 text-sm border border-gray-200 outline-none focus:border-black transition-colors"
          />
          <span className="text-gray-400">-</span>
          <input
            type="number"
            placeholder="Max"
            value={priceRange.max}
            onChange={(e) =>
              setPriceRange({ ...priceRange, max: e.target.value })
            }
            className="w-full p-2 text-sm border border-gray-200 outline-none focus:border-black transition-colors"
          />
        </div>
        <button
          onClick={handleApplyPrice}
          className="w-full py-2 bg-black text-white text-xs font-bold uppercase hover:bg-red-600 transition-colors"
        >
          Áp dụng
        </button>
      </div>

      <hr className="border-gray-100" />

      {/* 3. Colors */}
      <div>
        <h3 className="text-sm font-bold uppercase tracking-wider mb-4 text-gray-900">
          Màu sắc
        </h3>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => updateQuery({ color: "" })}
            className={`px-3 py-1 text-xs border transition-all ${
              color === ""
                ? "bg-black text-white border-black"
                : "bg-white text-gray-600 border-gray-200 hover:border-black"
            }`}
          >
            Tất cả
          </button>
          {availableColors.map((c) => (
            <button
              key={c}
              onClick={() => updateQuery({ color: c })}
              className={`px-3 py-1 text-xs border transition-all uppercase ${
                color === c
                  ? "bg-black text-white border-black"
                  : "bg-white text-gray-600 border-gray-200 hover:border-black"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Nút xóa lọc */}
      {(minPrice || maxPrice || color || sort !== "newest") && (
        <button
          onClick={clearAllFilters}
          className="text-xs text-red-500 font-medium underline mt-4 hover:text-red-700"
        >
          Xóa tất cả bộ lọc
        </button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 pt-10 pb-20">
      {/* HEADER */}
      <div className="text-center mb-12 px-4">
        <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tight mb-4">
          Tất cả sản phẩm
        </h1>
        <p className="text-gray-500 max-w-xl mx-auto text-sm md:text-base">
          Khám phá bộ sưu tập mới nhất với thiết kế tối giản và chất liệu cao
          cấp.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex flex-col lg:flex-row gap-10">
          {/* === SIDEBAR (DESKTOP) === */}
          <aside className="hidden lg:block w-1/4 sticky top-24 h-fit">
            <FilterContent />
          </aside>

          {/* === MOBILE FILTER DRAWER === */}
          <div
            className={`fixed inset-0 z-50 transform ${
              showMobileFilter ? "translate-x-0" : "-translate-x-full"
            } transition-transform duration-300 lg:hidden`}
          >
            <div
              className="absolute inset-0 bg-black/50"
              onClick={() => setShowMobileFilter(false)}
            ></div>
            <div className="absolute left-0 top-0 bottom-0 w-4/5 max-w-xs bg-white p-6 overflow-y-auto shadow-2xl">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold uppercase">Bộ lọc</h2>
                <button onClick={() => setShowMobileFilter(false)}>
                  <X size={24} />
                </button>
              </div>
              <FilterContent />
            </div>
          </div>

          {/* === MAIN CONTENT === */}
          <main className="lg:w-3/4 w-full">
            {/* Mobile Filter Trigger Button */}
            <div className="lg:hidden mb-6 flex justify-between items-center border border-gray-200 p-3 rounded">
              <span className="text-sm font-bold">
                {products.length} Sản phẩm
              </span>
              <button
                onClick={() => setShowMobileFilter(true)}
                className="flex items-center gap-2 text-sm font-medium text-gray-700"
              >
                <Filter size={18} /> Bộ lọc & Sắp xếp
              </button>
            </div>

            {/* Tags đang lọc (Hiển thị nhanh) */}
            {(color || minPrice || maxPrice) && (
              <div className="flex flex-wrap gap-2 mb-6 text-sm">
                {color && (
                  <span className="bg-gray-100 px-3 py-1 rounded-full flex items-center gap-1">
                    Màu: {color}{" "}
                    <X
                      size={14}
                      className="cursor-pointer"
                      onClick={() => updateQuery({ color: "" })}
                    />
                  </span>
                )}
                {(minPrice || maxPrice) && (
                  <span className="bg-gray-100 px-3 py-1 rounded-full flex items-center gap-1">
                    Giá: {minPrice || 0} - {maxPrice || "..."}{" "}
                    <X
                      size={14}
                      className="cursor-pointer"
                      onClick={() =>
                        updateQuery({ minPrice: "", maxPrice: "" })
                      }
                    />
                  </span>
                )}
              </div>
            )}

            {/* Loading State */}
            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="animate-pulse">
                    <div className="bg-gray-100 aspect-[3/4] w-full mb-3"></div>
                    <div className="bg-gray-100 h-4 w-3/4 mb-2"></div>
                    <div className="bg-gray-100 h-4 w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              /* Empty State */
              <div className="text-center py-20 bg-gray-50 rounded-lg">
                <SlidersHorizontal className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-gray-900">
                  Không tìm thấy sản phẩm
                </h3>
                <p className="text-gray-500 mb-6">
                  Thử thay đổi bộ lọc hoặc xem tất cả sản phẩm.
                </p>
                <button
                  onClick={clearAllFilters}
                  className="px-6 py-2 bg-black text-white text-sm font-bold uppercase hover:bg-gray-800"
                >
                  Xóa bộ lọc
                </button>
              </div>
            ) : (
              /* Product Grid */
              <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-10">
                {products.map((product) => {
                  // Xác định variant đang active dựa trên filter màu
                  // Nếu user lọc màu 'Red', ta truyền variant màu Red vào ProductCard để nó hiển thị ảnh đỏ
                  const activeVariant = color
                    ? product.variants?.find((v) => v.color === color)
                    : null;

                  return (
                    <div
                      key={product._id}
                      className="transition-transform duration-300 hover:-translate-y-1"
                    >
                      <ProductCard
                        product={product}
                        activeVariant={activeVariant}
                      />
                    </div>
                  );
                })}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
