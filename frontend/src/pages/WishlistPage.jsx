import { useEffect, useState } from "react";
import axios from "axios";
import { HeartOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ProductCard from "../components/ProductCard";

const WishlistPage = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // =====================
  // FETCH WISHLIST
  // =====================
  const fetchWishlist = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/wishlist`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setWishlist(res.data.items || []);
    } catch (err) {
      console.error("Fetch wishlist error:", err);
    } finally {
      setLoading(false);
    }
  };

  // =====================
  // REMOVE FROM WISHLIST
  // =====================
  const removeFromWishlist = async (productId) => {
    try {
      const token = localStorage.getItem("token");

      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/wishlist/${productId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      // cập nhật UI ngay
      setWishlist((prev) =>
        prev.filter((item) => item.productId._id !== productId),
      );
    } catch (error) {
      console.error("Remove wishlist error:", error);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  // =====================
  // LOADING
  // =====================
  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-gray-500">
        Đang tải wishlist...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl md:text-2xl font-bold text-gray-900">
          ❤️ Sản phẩm yêu thích
        </h1>
        <span className="text-sm text-gray-500">
          {wishlist.length} sản phẩm
        </span>
      </div>

      {/* EMPTY STATE */}
      {wishlist.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-gray-500">
          <HeartOff size={48} className="mb-4 opacity-40" />
          <p className="text-lg font-medium mb-1">
            Wishlist của bạn đang trống
          </p>
          <p className="text-sm">
            Thêm sản phẩm bạn yêu thích để xem lại sau nhé!
          </p>
        </div>
      )}

      {/* GRID */}
      {wishlist.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {wishlist.map((item) => (
            <div key={item._id} className="relative group">
              {/* NÚT XÓA WISHLIST */}
              <button
                onClick={() => removeFromWishlist(item.productId._id)}
                className="absolute top-3 right-3 z-30 p-2 rounded-full
                           bg-white/90 text-gray-600 hover:text-red-600
                           shadow-md transition"
                title="Bỏ yêu thích"
              >
                <HeartOff size={16} />
              </button>

              {/* PRODUCT CARD */}
              <ProductCard
                product={{
                  ...item.productId,
                  reviewCount: item.productId.numReviews ?? 0,
                }}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WishlistPage;
