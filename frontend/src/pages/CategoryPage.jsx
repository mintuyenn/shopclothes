import React, { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import axios from "axios";
import ProductCard from "../components/ProductCard";
import FilterBar from "../components/FilterBar";

const CategoryPage = () => {
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;
  const minPrice = searchParams.get("minPrice") || "";
  const maxPrice = searchParams.get("maxPrice") || "";
  const color = searchParams.get("color") || "";
  const sort = searchParams.get("sort") || "";

  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5001/api/categories/${id}`
        );
        setCategory(res.data);
      } catch (err) {
        console.error("Lỗi khi tải thông tin danh mục:", err);
      }
    };
    fetchCategory();
  }, [id]);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `http://localhost:5001/api/products/by-category/${id}`,
          { params: { page, minPrice, maxPrice, color, sort } }
        );
        const data = res.data.data || [];
        setProducts(data);
        setTotalPages(res.data.totalPages || 1);

        const allColors = new Set();
        data.forEach((p) => {
          if (p.variants) p.variants.forEach((v) => allColors.add(v.color));
        });
      } catch (err) {
        console.error("Lỗi khi tải sản phẩm:", err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [id, page, minPrice, maxPrice, color, sort]);

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

  return (
    <div className="bg-blue-50 min-h-screen pt-20 px-6 md:px-12">
      {/* Tiêu đề */}
      <div className="text-center mb-6">
        <h1 className="text-4xl md:text-5xl font-extrabold uppercase bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-pink-600 animate-pulse">
          DANH MỤC SẢN PHẨM{" "}
          {category ? category.name.toUpperCase() : "DANH MỤC"}
        </h1>
        <p className="mt-2 text-blue-800 text-lg md:text-xl font-semibold">
          Khám phá những sản phẩm nổi bật và hấp dẫn nhất trong danh mục này!
        </p>
      </div>

      {/* Sản phẩm */}
      {loading ? (
        <div className="flex justify-center items-center text-gray-500 text-lg h-64">
          Đang tải sản phẩm...
        </div>
      ) : products.length === 0 ? (
        <p className="text-gray-500 text-center mt-10">
          Không có sản phẩm nào trong danh mục này.
        </p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {products.map((product) =>
            product.variants && product.variants.length > 0 ? (
              product.variants.map((variant) => (
                <div
                  key={`${product._id}-${variant._id}`}
                  className="transition-transform duration-300 hover:scale-105"
                >
                  <ProductCard product={product} activeVariant={variant} />
                </div>
              ))
            ) : (
              <div
                key={product._id}
                className="transition-transform duration-300 hover:scale-105"
              >
                <ProductCard product={product} />
              </div>
            )
          )}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-8 gap-3">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => updateQuery({ page: i + 1 })}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                page === i + 1
                  ? "bg-red-500 text-white shadow-lg scale-105"
                  : "bg-white border text-gray-700 hover:bg-red-50 hover:scale-105"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryPage;
