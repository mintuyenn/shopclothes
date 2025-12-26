import React, { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import axios from "axios";
import ProductCard from "../components/ProductCard";
import { Filter, X, SlidersHorizontal } from "lucide-react";

const CategoryPage = () => {
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  // --- URL Params ---
  const page = Number(searchParams.get("page")) || 1;
  const minPrice = searchParams.get("minPrice") || "";
  const maxPrice = searchParams.get("maxPrice") || "";
  const color = searchParams.get("color") || "";
  const sort = searchParams.get("sort") || "newest";

  // --- State ---
  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [availableColors, setAvailableColors] = useState([]); // Màu có sẵn trong danh mục
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [showMobileFilter, setShowMobileFilter] = useState(false);
  const API_URL = `${import.meta.env.VITE_API_URL}/api`;

  // Local state cho input giá (nhập xong mới bấm Apply)
  const [priceRange, setPriceRange] = useState({
    min: minPrice,
    max: maxPrice,
  });

  // --- 1. Fetch Category Info (Tên danh mục) ---
  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const res = await axios.get(`${API_URL}/categories/${id}`);
        setCategory(res.data);
      } catch (err) {
        console.error("Lỗi tải thông tin danh mục:", err);
      }
    };
    fetchCategory();
  }, [id]);

  // --- 2. Fetch Products (Có Filter) ---
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${API_URL}/products/by-category/${id}`, {
          params: {
            page,
            limit: 12, // Số lượng sản phẩm mỗi trang
            minPrice,
            maxPrice,
            color,
            sort,
          },
        });

        const data = res.data.data || [];
        setProducts(data);
        setTotalPages(res.data.totalPages || 1);

        // Logic: Quét toàn bộ sản phẩm tải về để lấy ra danh sách các màu CÓ THẬT trong danh mục này
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

    // Sync lại input giá khi URL thay đổi (VD: User bấm Back trên trình duyệt)
    setPriceRange({ min: minPrice, max: maxPrice });
  }, [id, page, minPrice, maxPrice, color, sort]);

  // --- Helpers ---
  const updateQuery = (newParams) => {
    const currentParams = Object.fromEntries(searchParams.entries());
    const mergedParams = { ...currentParams, ...newParams };

    // Xóa các key rỗng hoặc undefined
    Object.keys(mergedParams).forEach((key) => {
      if (!mergedParams[key]) delete mergedParams[key];
    });

    setSearchParams(mergedParams);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleApplyPrice = () => {
    updateQuery({
      minPrice: priceRange.min,
      maxPrice: priceRange.max,
      page: 1,
    });
    setShowMobileFilter(false);
  };

  const clearAllFilters = () => {
    setPriceRange({ min: "", max: "" });
    // Giữ lại id, chỉ xóa các params filter
    setSearchParams({ page: 1 });
  };

  // --- Sidebar Content Component (Tái sử dụng) ---
  const FilterSidebar = () => (
    <div className="space-y-8">
      {/* Sort */}
      <div>
        <h3 className="text-sm font-bold uppercase tracking-wider mb-3">
          Sắp xếp
        </h3>
        <div className="space-y-2">
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
                className={`w-4 h-4 border flex items-center justify-center ${
                  sort === opt.value ? "border-red-600" : "border-gray-300"
                }`}
              >
                {sort === opt.value && (
                  <div className="w-2 h-2 bg-red-600"></div>
                )}
              </div>
              <input
                type="radio"
                name="sort"
                className="hidden"
                checked={sort === opt.value}
                onChange={() => updateQuery({ sort: opt.value, page: 1 })}
              />
              <span
                className={`text-sm ${
                  sort === opt.value ? "font-bold" : "text-gray-600"
                }`}
              >
                {opt.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      <hr className="border-gray-100" />

      {/* Price */}
      <div>
        <h3 className="text-sm font-bold uppercase tracking-wider mb-3">
          Khoảng giá
        </h3>
        <div className="flex gap-2 items-center mb-3">
          <input
            type="number"
            placeholder="Min"
            value={priceRange.min}
            onChange={(e) =>
              setPriceRange({ ...priceRange, min: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-200 text-sm outline-none focus:border-black"
          />
          <span className="text-gray-400">-</span>
          <input
            type="number"
            placeholder="Max"
            value={priceRange.max}
            onChange={(e) =>
              setPriceRange({ ...priceRange, max: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-200 text-sm outline-none focus:border-black"
          />
        </div>
        <button
          onClick={handleApplyPrice}
          className="w-full bg-black text-white text-xs font-bold py-2 uppercase hover:bg-red-600 transition-colors"
        >
          Áp dụng
        </button>
      </div>

      <hr className="border-gray-100" />

      {/* Colors */}
      <div>
        <h3 className="text-sm font-bold uppercase tracking-wider mb-3">
          Màu sắc
        </h3>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => updateQuery({ color: "", page: 1 })}
            className={`px-3 py-1 text-xs border transition-all ${
              !color
                ? "bg-black text-white border-black"
                : "bg-white text-gray-600 hover:border-black"
            }`}
          >
            Tất cả
          </button>
          {availableColors.map((c) => (
            <button
              key={c}
              onClick={() => updateQuery({ color: c, page: 1 })}
              className={`px-3 py-1 text-xs border uppercase transition-all ${
                color === c
                  ? "bg-black text-white border-black"
                  : "bg-white text-gray-600 hover:border-black"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Clear Button */}
      {(minPrice || maxPrice || color || sort !== "newest") && (
        <button
          onClick={clearAllFilters}
          className="text-xs text-red-500 underline font-medium mt-4"
        >
          Xóa bộ lọc
        </button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-white font-sans pt-10 pb-20">
      {/* Header Danh mục */}
      <div className="bg-gray-50 py-12 mb-10 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-gray-400 text-xs md:text-sm uppercase tracking-widest mb-2 font-bold">
            Danh mục sản phẩm
          </p>
          <h1 className="text-3xl md:text-5xl font-black text-gray-900 uppercase tracking-tight mb-4">
            {category ? category.name : "..."}
          </h1>
          <div className="w-16 h-1 bg-red-600 mx-auto"></div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex flex-col lg:flex-row gap-10">
          {/* === SIDEBAR (DESKTOP) === */}
          <aside className="hidden lg:block lg:w-1/4 sticky top-24 h-fit">
            <FilterSidebar />
          </aside>

          {/* === MOBILE FILTER DRAWER === */}
          <div
            className={`fixed inset-0 z-50 lg:hidden transition-transform duration-300 ${
              showMobileFilter ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            <div
              className="absolute inset-0 bg-black/50"
              onClick={() => setShowMobileFilter(false)}
            ></div>
            <div className="absolute left-0 top-0 bottom-0 w-4/5 bg-white p-6 overflow-y-auto shadow-xl">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold uppercase">Bộ lọc</h2>
                <button onClick={() => setShowMobileFilter(false)}>
                  <X size={24} />
                </button>
              </div>
              <FilterSidebar />
            </div>
          </div>

          {/* === MAIN CONTENT === */}
          <main className="lg:w-3/4 w-full">
            {/* Mobile Trigger & Info Bar */}
            <div className="flex justify-between items-center mb-6 border border-gray-100 p-3 rounded-lg bg-white shadow-sm">
              <span className="text-sm font-bold text-gray-900">
                {products.length} Sản phẩm
              </span>
              <button
                onClick={() => setShowMobileFilter(true)}
                className="lg:hidden flex items-center gap-2 text-sm font-medium"
              >
                <Filter size={18} /> Bộ lọc
              </button>
            </div>

            {/* Tags hiển thị nhanh */}
            {(color || minPrice || maxPrice) && (
              <div className="flex flex-wrap gap-2 mb-6 text-sm animate-fade-in">
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
                    Giá: {minPrice} - {maxPrice}{" "}
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

            {/* Product Grid */}
            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                  <div key={i} className="animate-pulse">
                    <div className="bg-gray-100 aspect-[3/4] w-full mb-3 rounded-sm"></div>
                    <div className="bg-gray-100 h-4 w-3/4 mb-2 rounded-sm"></div>
                    <div className="bg-gray-100 h-4 w-1/2 rounded-sm"></div>
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-20 bg-gray-50 rounded-lg">
                <SlidersHorizontal
                  size={40}
                  className="mx-auto text-gray-300 mb-4"
                />
                <p className="text-gray-500 font-medium">
                  Không tìm thấy sản phẩm phù hợp trong danh mục này.
                </p>
                <button
                  onClick={clearAllFilters}
                  className="mt-4 text-red-600 font-bold hover:underline text-sm"
                >
                  Xóa bộ lọc
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
                {products.map((product) => {
                  // Nếu user đang lọc theo màu, hiển thị đúng variant màu đó trên card
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

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-12 gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (pageNum) => (
                    <button
                      key={pageNum}
                      onClick={() => updateQuery({ page: pageNum })}
                      className={`w-10 h-10 flex items-center justify-center text-sm font-bold border transition-all ${
                        page === pageNum
                          ? "bg-black text-white border-black"
                          : "bg-white text-gray-900 border-gray-200 hover:border-black"
                      }`}
                    >
                      {pageNum}
                    </button>
                  )
                )}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;
