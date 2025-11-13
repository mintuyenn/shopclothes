import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  ShoppingCart,
  ChevronRight,
  Plus,
  Minus,
  ShieldCheck,
  Truck,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

import { useCart } from "../context/CartContext";

const ProductLoader = () => (
  <div className="container mx-auto px-4 py-8 animate-pulse">
    <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
    <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
        <div>
          <div className="h-96 md:h-[500px] bg-gray-200 rounded-lg mb-4"></div>
          <div className="flex gap-2">
            <div className="w-20 h-20 bg-gray-200 rounded-lg"></div>
            <div className="w-20 h-20 bg-gray-200 rounded-lg"></div>
            <div className="w-20 h-20 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
        <div>
          <div className="h-10 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-6 bg-gray-200 rounded w-1/2 mb-6"></div>
          <div className="h-12 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-2"></div>
          <div className="flex gap-2 mb-6">
            <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
            <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
          </div>
          <div className="h-12 bg-gray-200 rounded-lg w-full mb-3"></div>
          <div className="h-12 bg-gray-200 rounded-lg w-full"></div>
        </div>
      </div>
    </div>
  </div>
);

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedImage, setSelectedImage] = useState("/placeholder.png");
  const [quantity, setQuantity] = useState(1);
  const [toast, setToast] = useState(null);

  // === Fetch Product ===
  useEffect(() => {
    const getProduct = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`http://localhost:5001/api/products/${id}`);
        const p = res.data;
        setProduct(p);

        const v = p.variants?.[0] || null;
        setSelectedVariant(v);

        const firstSize =
          v?.sizes?.find((s) => s.stock > 0) || v?.sizes?.[0] || null;
        setSelectedSize(firstSize);

        setSelectedImage(v?.images?.[0] || p.images?.[0] || "/placeholder.png");
      } catch (err) {
        console.error(err);
        setError("Không thể tải sản phẩm.");
      } finally {
        setLoading(false);
      }
    };
    getProduct();
  }, [id]);

  const handleVariantSelect = (variant) => {
    setSelectedVariant(variant);
    const size =
      variant.sizes?.find((s) => s.stock > 0) || variant.sizes?.[0] || null;
    setSelectedSize(size);
    setSelectedImage(variant.images?.[0] || "/placeholder.png");
    setQuantity(1);
  };

  const handleSizeSelect = (size) => {
    setSelectedSize(size);
    setQuantity(1);
  };

  const handleQuantityChange = (chg) => {
    setQuantity((prev) => {
      const newQty = prev + chg;
      const maxStock =
        selectedSize?.stock ?? selectedVariant?.stock ?? product?.stock ?? 0;
      if (newQty < 1) return 1;
      if (newQty > maxStock) return maxStock;
      return newQty;
    });
  };

  const showToast = (text, type = "success") => {
    setToast({ text, type });
    setTimeout(() => setToast(null), 2000);
  };

  const handleAddToCart = async () => {
    const variant = selectedVariant ?? null;
    const sizeObj = selectedSize ?? null;

    // Xác định stock: ưu tiên size → variant → product
    const stock = sizeObj?.stock ?? variant?.stock ?? product.stock ?? 0;

    if (stock <= 0) {
      showToast("Sản phẩm đã hết hàng!", "error");
      return;
    }

    // Kiểm tra số lượng trong giỏ
    const cartData = JSON.parse(localStorage.getItem("cart")) || [];
    const existingItem = cartData.find(
      (item) =>
        item.productId === product._id &&
        (variant ? item.color === variant.color : true) &&
        (sizeObj ? item.size === sizeObj.size : true)
    );
    const currentQty = existingItem ? existingItem.quantity : 0;

    if (currentQty + quantity > stock) {
      showToast(`Chỉ còn ${stock} sản phẩm!`, "error");
      return;
    }

    try {
      await addToCart({
        productId: product._id,
        color: variant?.color ?? null,
        size: sizeObj?.size ?? null,
        image: selectedImage,
        quantity,
        price: product.price,
        salePrice: product.finalPrice ?? product.price,
      });

      showToast(`Sản phẩm đã thêm vào giỏ`, "success");
    } catch (err) {
      console.error(err);
      showToast("Thêm vào giỏ hàng thất bại. Vui lòng thử lại.", "error");
    }
  };

  const handleBuyNow = async () => {
    await handleAddToCart();
    navigate("/cart");
  };

  if (loading) return <ProductLoader />;
  if (error)
    return <div className="text-center text-red-500 mt-20">{error}</div>;
  if (!product)
    return <div className="text-center mt-20">Không có sản phẩm.</div>;

  const price = product?.price ?? 0;
  const discountInfo = product?.discountInfo;
  const discountedPrice =
    product?.finalPrice ??
    (discountInfo?.type === "percent"
      ? price * (1 - discountInfo.value / 100)
      : discountInfo?.type === "fixed"
      ? price - discountInfo.value
      : price);
  const originalPrice = price;
  const stock =
    selectedSize?.stock ?? // ưu tiên size trong variant
    selectedVariant?.stock ?? // nếu variant không có size
    product.stock ??
    0; // fallback product.stock

  const canAdd = stock > 0;

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-5 right-5 px-4 py-3 rounded-xl shadow-lg flex items-center gap-2 text-white z-50 animate-slide`}
          style={{
            backgroundColor: toast.type === "success" ? "#1abc9c" : "#e74c3c",
          }}
        >
          {toast.type === "success" ? (
            <CheckCircle size={18} />
          ) : (
            <AlertCircle size={18} />
          )}
          <span className="text-sm font-medium">{toast.text}</span>
        </div>
      )}

      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <div className="flex items-center text-sm text-gray-500 mb-4">
          <span
            className="hover:underline cursor-pointer"
            onClick={() => navigate("/")}
          >
            Trang chủ
          </span>
          <ChevronRight className="h-4 w-4 mx-1" />
          <span className="font-medium text-gray-900">{product.name}</span>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Images */}
          <div>
            <img
              src={selectedImage}
              className="w-full h-[500px] rounded-lg object-cover"
            />
            <div className="flex gap-2 mt-2 overflow-x-auto">
              {selectedVariant?.images?.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(img)}
                  className={`w-20 h-20 rounded border ${
                    selectedImage === img ? "border-red-500" : "border-gray-300"
                  }`}
                >
                  <img src={img} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Info */}
          <div>
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>

            {discountInfo && (
              <div className="inline-block bg-red-600 text-white text-xs font-semibold px-3 py-1 rounded-full mb-2">
                {discountInfo.type === "percent"
                  ? `-${discountInfo.value}%`
                  : discountInfo.type === "fixed"
                  ? `-${discountInfo.value.toLocaleString("vi-VN")}đ`
                  : discountInfo.name}
              </div>
            )}

            <div className="mb-4">
              <span className="text-3xl font-bold text-red-600">
                {discountedPrice.toLocaleString("vi-VN")}đ
              </span>
              {discountedPrice < originalPrice && (
                <span className="ml-3 line-through text-gray-400 text-xl">
                  {originalPrice.toLocaleString("vi-VN")}đ
                </span>
              )}
            </div>

            {/* Color */}
            <div className="mb-4">
              <h3 className="text-sm font-semibold mb-1">
                Màu: {selectedVariant?.color}
              </h3>
              <div className="flex gap-2">
                {product.variants?.map((v) => (
                  <button
                    key={v._id}
                    onClick={() => handleVariantSelect(v)}
                    className={`w-10 h-10 rounded-full border-2 overflow-hidden ${
                      selectedVariant?._id === v._id
                        ? "border-red-500 scale-110"
                        : "border-gray-300"
                    }`}
                  >
                    <img
                      src={v.images?.[0]}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Size */}
            {selectedVariant?.sizes && (
              <div className="mb-4">
                <h3 className="text-sm font-semibold mb-1">
                  Kích cỡ: {selectedSize?.size}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {selectedVariant.sizes.map((s) => (
                    <button
                      key={s._id}
                      disabled={s.stock === 0}
                      onClick={() => handleSizeSelect(s)}
                      className={`px-4 py-2 rounded border text-sm ${
                        selectedSize?._id === s._id
                          ? "bg-red-600 text-white"
                          : "border-gray-300"
                      } ${s.stock === 0 ? "bg-gray-100 text-gray-400" : ""}`}
                    >
                      {s.size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="mb-4">
              <h3 className="text-sm font-semibold mb-1">Số lượng</h3>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1}
                  className="px-3 py-2 border rounded disabled:opacity-40"
                >
                  <Minus size={16} />
                </button>
                <span className="px-4 py-2 border">{quantity}</span>
                <button
                  onClick={() => handleQuantityChange(1)}
                  disabled={quantity >= stock}
                  className="px-3 py-2 border rounded disabled:opacity-40"
                >
                  <Plus size={16} />
                </button>
                <span className="text-sm text-gray-500">
                  {stock > 0 ? `${stock} sản phẩm còn trong kho` : "Hết hàng"}
                </span>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 mb-4">
              <button
                onClick={handleAddToCart}
                disabled={!canAdd}
                className="flex-1 border border-red-600 text-red-600 py-3 rounded-lg font-semibold hover:bg-red-50 disabled:bg-gray-200"
              >
                <ShoppingCart className="inline mr-2" /> Thêm vào giỏ
              </button>
              <button
                onClick={handleBuyNow}
                disabled={!canAdd}
                className="flex-1 bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 disabled:bg-gray-400"
              >
                Mua ngay
              </button>
            </div>

            <div className="border-t pt-4 text-sm text-gray-700">
              <div className="flex items-center gap-2 mb-2">
                <Truck size={18} /> Giao hàng toàn quốc
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck size={18} /> Đổi trả trong 30 ngày
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="bg-white rounded-xl shadow p-6 mt-8">
          <h2 className="text-xl font-bold mb-4 tracking-wide uppercase text-gray-800">
            Mô tả sản phẩm
          </h2>
          <p className="whitespace-pre-line text-gray-700 leading-relaxed mb-6">
            {product.description || "Chưa có mô tả."}
          </p>

          <div className="space-y-3 text-gray-700">
            {[
              "Sợi vải cao cấp, bền và mềm mại, giữ form chuẩn",
              "Công nghệ dệt thoáng khí, thoải mái cả ngày dài",
              "Đường may tỉ mỉ – hoàn thiện sắc nét từng chi tiết",
              "Thiết kế tinh gọn, sang trọng – dễ phối với đa dạng outfit",
              "Chống nhăn tốt, giữ phom lịch lãm suốt ngày dài",
              "Lựa chọn tối ưu cho đi làm, dự tiệc hoặc gặp gỡ đối tác",
            ].map((text, i) => (
              <div key={i} className="flex items-start gap-2">
                <span className="text-lg">🧵</span>
                <span className="leading-relaxed">{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
