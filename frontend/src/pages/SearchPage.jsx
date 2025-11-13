import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import ProductCard from "../components/ProductCard"; // Component hiển thị sản phẩm

const SearchPage = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search).get("q") || "";

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      if (!query) return;
      try {
        setLoading(true);
        const res = await axios.get(
          `http://localhost:5001/api/products/search?q=${encodeURIComponent(
            query
          )}`
        );
        setProducts(res.data.data || []);
      } catch (err) {
        console.error("Lỗi khi tìm kiếm:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [query]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-lg text-gray-500">
        Đang tìm kiếm sản phẩm...
      </div>
    );
  }

  return (
    <div className="p-8 bg-yellow-50 min-h-screen">
      <div className="max-w-[1400px] mx-auto bg-yellow-100 rounded-3xl p-6 shadow-lg">
        <h1 className="text-2xl font-bold mb-6 text-red-500 text-center">
          Kết quả tìm kiếm: {query}
        </h1>

        {products.length === 0 ? (
          <p className="text-gray-500 text-center mt-10">
            Không tìm thấy sản phẩm nào phù hợp.
          </p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8">
            {products.map((product) => (
              <div
                key={product._id}
                className="bg-white p-2 rounded-2xl shadow-md hover:shadow-lg transition-transform transform hover:-translate-y-1"
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
