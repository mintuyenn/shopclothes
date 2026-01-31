import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
// Framer Motion & Icons
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingCart,
  ChevronRight,
  Plus,
  Minus,
  Star,
  Truck,
  ShieldCheck,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
} from "lucide-react";

import { useCart } from "../context/CartContext";

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [sold, setSold] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedImage, setSelectedImage] = useState("/placeholder.png");
  const [quantity, setQuantity] = useState(1);
  const [toast, setToast] = useState(null);
  const API_URL = `${import.meta.env.VITE_API_URL}/api`;

  // === Fetch Product + Sold (LOGIC GIỮ NGUYÊN) ===
  useEffect(() => {
    const getProduct = async () => {
      try {
        setLoading(true);
        // Product
        const res = await axios.get(`${API_URL}/products/${id}`);
        const p = res.data;
        setProduct(p);

        const v = p.variants?.[0] || null;
        setSelectedVariant(v);

        const firstSize =
          v?.sizes?.find((s) => s.stock > 0) || v?.sizes?.[0] || null;
        setSelectedSize(firstSize);

        setSelectedImage(v?.images?.[0] || p.images?.[0] || "/placeholder.png");

        // Sold
        const soldRes = await axios.get(`${API_URL}/orders/sold/${id}`);
        setSold(soldRes.data.sold ?? 0);
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

  const isLoggedIn = () => {
    const token = localStorage.getItem("token");
    return !!token;
  };

  const handleAddToCart = async () => {
    if (!isLoggedIn()) {
      showToast("Bạn cần đăng nhập để thêm vào giỏ!", "error");
      navigate("/login");
      return;
    }
    const variant = selectedVariant ?? null;
    const sizeObj = selectedSize ?? null;

    const stock = sizeObj?.stock ?? variant?.stock ?? product.stock ?? 0;
    if (stock <= 0) {
      showToast("Sản phẩm đã hết hàng!", "error");
      return;
    }

    const cartData = JSON.parse(localStorage.getItem("cart")) || [];
    const existingItem = cartData.find(
      (item) =>
        item.productId === product._id &&
        (variant ? item.color === variant.color : true) &&
        (sizeObj ? item.size === sizeObj.size : true),
    );
    const currentQty = existingItem ? existingItem.quantity : 0;
    if (currentQty + quantity > stock) {
      showToast(`Chỉ còn ${stock} sản phẩm!`, "error");
      return;
    }

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
  };

  const handleBuyNow = async () => {
    await handleAddToCart();
    navigate("/cart");
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-10 h-10 border-4 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center bg-white text-red-500">
        {error}
      </div>
    );

  if (!product)
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        Không tìm thấy sản phẩm.
      </div>
    );

  const discountedPrice = product.finalPrice ?? product.price;
  const originalPrice = product.price;
  const stock =
    selectedSize?.stock ?? selectedVariant?.stock ?? product.stock ?? 0;
  const canAdd = stock > 0;

  return (
    <div className="bg-gray-50 min-h-screen py-10 font-sans text-slate-900 selection:bg-slate-900 selection:text-white">
      {/* Toast Notification Styled */}
      {/* --- SỬA LỖI: Dùng trực tiếp AnimatePresence --- */}
      <AnimatePresence>
        {toast && (
          /* --- SỬA LỖI: Dùng trực tiếp motion.div --- */
          <motion.div
            initial={{ opacity: 0, y: -20, x: 20 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-24 right-5 px-6 py-4 rounded shadow-xl flex items-center gap-3 z-50 border-l-4 bg-white ${
              toast.type === "success"
                ? "border-green-500 text-slate-800"
                : "border-red-500 text-slate-800"
            }`}
          >
            {toast.type === "success" ? (
              <CheckCircle size={20} className="text-green-500" />
            ) : (
              <AlertCircle size={20} className="text-red-500" />
            )}
            <span className="font-semibold text-sm">{toast.text}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="container mx-auto px-4 max-w-6xl">
        {/* Breadcrumb Styled */}
        <div className="flex items-center text-xs font-medium text-slate-500 mb-8 uppercase tracking-wider">
          <span
            className="hover:text-slate-900 cursor-pointer transition-colors"
            onClick={() => navigate("/")}
          >
            Trang chủ
          </span>
          <ChevronRight className="h-3 w-3 mx-2" />
          <span className="text-slate-900 line-clamp-1">{product.name}</span>
        </div>

        {/* --- SỬA LỖI: Dùng trực tiếp motion.div --- */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-12"
        >
          {/* LEFT: Images */}
          <div className="space-y-4">
            <div className="aspect-[4/5] bg-gray-100 rounded-sm overflow-hidden relative group">
              <img
                src={selectedImage}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
              {selectedVariant?.images?.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(img)}
                  className={`w-20 h-24 flex-shrink-0 bg-gray-100 rounded-sm overflow-hidden border-2 transition-all ${
                    selectedImage === img
                      ? "border-slate-900 opacity-100"
                      : "border-transparent opacity-60 hover:opacity-100"
                  }`}
                >
                  <img
                    src={img}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* RIGHT: Info */}
          <div className="flex flex-col">
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 tracking-tight leading-tight">
              {product.name}
            </h1>

            {/* Rating & Sold */}
            {product.averageRating > 0 && (
              <div className="flex items-center gap-4 mb-6 text-sm">
                <div className="flex items-center gap-1 text-yellow-500">
                  <Star size={16} fill="currentColor" />
                  <span className="font-bold text-slate-900 ml-1">
                    {product.averageRating.toFixed(1)}
                  </span>
                </div>
                <div className="w-px h-4 bg-gray-300"></div>
                <span className="text-slate-500">
                  {product.numReviews ?? 0} đánh giá
                </span>
                <div className="w-px h-4 bg-gray-300"></div>
                <span className="text-slate-500">Đã bán {sold}</span>
                <button
                  onClick={() =>
                    document
                      .getElementById("reviews-section")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                  className="ml-auto text-slate-900 font-bold underline underline-offset-4 text-xs uppercase tracking-wider"
                >
                  Xem đánh giá
                </button>
              </div>
            )}

            {/* Price */}
            <div className="mb-8 flex items-baseline gap-4">
              <span className="text-3xl font-bold text-slate-900">
                {discountedPrice.toLocaleString("vi-VN")}đ
              </span>
              {discountedPrice < originalPrice && (
                <span className="text-lg text-slate-400 line-through decoration-slate-400">
                  {originalPrice.toLocaleString("vi-VN")}đ
                </span>
              )}
            </div>

            <div className="h-px bg-gray-100 w-full mb-8"></div>

            {/* Selector: Color */}
            <div className="mb-6">
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-900 mb-3">
                Màu sắc:{" "}
                <span className="text-slate-500 font-normal ml-1">
                  {selectedVariant?.color}
                </span>
              </h3>
              <div className="flex flex-wrap gap-3">
                {product.variants?.map((v) => (
                  <button
                    key={v._id}
                    onClick={() => handleVariantSelect(v)}
                    className={`group relative w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                      selectedVariant?._id === v._id
                        ? "ring-2 ring-offset-2 ring-slate-900"
                        : "hover:ring-1 hover:ring-slate-300"
                    }`}
                  >
                    {/* Border viền cho màu */}
                    <span className="absolute inset-0 rounded-full border border-gray-200 pointer-events-none"></span>
                    <img
                      src={v.images?.[0]}
                      alt={v.color}
                      className="w-full h-full object-cover rounded-full"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Selector: Size */}
            {selectedVariant?.sizes && (
              <div className="mb-8">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-slate-900">
                    Kích thước:{" "}
                    <span className="text-slate-500 font-normal ml-1">
                      {selectedSize?.size}
                    </span>
                  </h3>
                </div>
                <div className="flex flex-wrap gap-3">
                  {selectedVariant.sizes.map((s) => (
                    <button
                      key={s._id}
                      disabled={s.stock === 0}
                      onClick={() => handleSizeSelect(s)}
                      className={`min-w-[3rem] h-10 px-4 rounded-sm text-sm font-medium transition-all border ${
                        selectedSize?._id === s._id
                          ? "bg-slate-900 text-white border-slate-900 shadow-md"
                          : "bg-white text-slate-900 border-gray-200 hover:border-slate-900"
                      } ${
                        s.stock === 0
                          ? "opacity-40 cursor-not-allowed bg-gray-50 decoration-slate-400 line-through"
                          : ""
                      }`}
                    >
                      {s.size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity & Add */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <div className="flex items-center border border-gray-200 rounded-sm w-fit">
                <button
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1}
                  className="px-4 py-3 hover:bg-gray-50 disabled:opacity-30 transition-colors"
                >
                  <Minus size={16} />
                </button>
                <span className="px-4 font-bold text-slate-900 w-12 text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => handleQuantityChange(1)}
                  disabled={quantity >= stock}
                  className="px-4 py-3 hover:bg-gray-50 disabled:opacity-30 transition-colors"
                >
                  <Plus size={16} />
                </button>
              </div>

              <div className="flex-1 flex gap-3">
                <button
                  onClick={handleAddToCart}
                  disabled={!canAdd}
                  className="flex-1 border border-slate-900 text-slate-900 py-3 rounded-sm font-bold uppercase tracking-widest text-xs hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Thêm vào giỏ
                </button>
                <button
                  onClick={handleBuyNow}
                  disabled={!canAdd}
                  className="flex-1 bg-slate-900 text-white py-3 rounded-sm font-bold uppercase tracking-widest text-xs hover:bg-black transition-colors shadow-lg shadow-slate-900/20 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {stock > 0 ? "Mua ngay" : "Hết hàng"}
                </button>
              </div>
            </div>

            {/* Stock status text */}
            <div className="mb-8 text-sm text-slate-500 flex items-center gap-2">
              <div
                className={`w-2 h-2 rounded-full ${
                  stock > 0 ? "bg-green-500" : "bg-red-500"
                }`}
              ></div>
              {stock > 0 ? `Còn ${stock} sản phẩm` : "Tạm thời hết hàng"}
            </div>

            {/* Policy */}
            <div className="grid grid-cols-2 gap-4 text-xs font-medium text-slate-600 bg-gray-50 p-5 rounded-sm border border-gray-100">
              <div className="flex items-center gap-3">
                <Truck size={18} className="text-slate-900" />
                <span>Miễn phí vận chuyển cho đơn hàng &gt; 500k</span>
              </div>
              <div className="flex items-center gap-3">
                <ShieldCheck size={18} className="text-slate-900" />
                <span>Bảo hành chính hãng 12 tháng</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle size={18} className="text-slate-900" />
                <span>Đổi trả miễn phí trong 30 ngày</span>
              </div>
              <div className="flex items-center gap-3">
                <AlertCircle size={18} className="text-slate-900" />
                <span>Hỗ trợ khách hàng 24/7</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Description & Reviews */}
        <div className="mt-20 grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* LEFT COL: Description */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-bold uppercase tracking-widest text-slate-900 mb-6 flex items-center gap-3">
              Mô tả chi tiết
              <div className="h-px bg-gray-200 flex-1"></div>
            </h2>
            <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed whitespace-pre-line">
              <p>{product.description || "Chưa có mô tả chi tiết."}</p>
              <div className="mt-4 p-6 bg-gray-50 rounded-sm border border-gray-100 text-sm">
                <ul className="list-disc pl-5 space-y-2 marker:text-slate-400">
                  <li>Chất liệu cotton 100%, mềm mại, thoáng mát</li>
                  <li>Thấm hút mồ hôi tốt, phù hợp cho mọi hoạt động</li>
                  <li>Thiết kế hiện đại, trẻ trung, phù hợp nhiều hoàn cảnh</li>
                  <li>Màu sắc đa dạng, dễ phối đồ</li>
                  <li>Dễ giặt, ít bị nhăn và co rút</li>
                  <li>Các size từ S đến XL, phù hợp nhiều vóc dáng</li>
                </ul>
              </div>
            </div>
          </div>

          {/* RIGHT COL: Reviews */}
          <div id="reviews-section" className="lg:col-span-1">
            <h2 className="text-xl font-bold uppercase tracking-widest text-slate-900 mb-6 flex items-center gap-3">
              Đánh giá{" "}
              <span className="text-sm font-normal text-slate-500 normal-case">
                ({product.reviews?.length || 0})
              </span>
              <div className="h-px bg-gray-200 flex-1"></div>
            </h2>

            <div className="space-y-6">
              {product.reviews?.length > 0 ? (
                product.reviews.map((r) => (
                  <div
                    key={r._id}
                    className="border-b border-gray-100 pb-6 last:border-0"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-slate-900 text-white rounded-full flex items-center justify-center font-bold text-sm">
                          {r.userId.fullName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-sm text-slate-900">
                            {r.userId.fullName}
                          </p>
                          <div className="flex gap-0.5 text-yellow-500 mt-0.5">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                size={12}
                                fill={i < r.rating ? "currentColor" : "none"}
                                className={i < r.rating ? "" : "text-gray-300"}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                      <span className="text-xs text-slate-400 font-medium">
                        {new Date(r.createdAt).toLocaleDateString("vi-VN")}
                      </span>
                    </div>
                    {/* Size & Color */}
                    {(r.color || r.size) && (
                      <div className="text-xs text-slate-500 mb-2 flex flex-wrap gap-2">
                        {r.color && (
                          <span className="px-2 py-0.5 bg-white border border-gray-200 rounded-sm">
                            Màu:{" "}
                            <strong className="text-slate-900">
                              {r.color}
                            </strong>
                          </span>
                        )}
                        {r.size && (
                          <span className="px-2 py-0.5 bg-white border border-gray-200 rounded-sm">
                            Size:{" "}
                            <strong className="text-slate-900">{r.size}</strong>
                          </span>
                        )}
                      </div>
                    )}

                    <p className="text-slate-600 text-sm leading-relaxed bg-gray-50 p-3 rounded-sm">
                      {r.comment}
                    </p>
                  </div>
                ))
              ) : (
                <div className="text-center py-10 bg-gray-50 rounded-sm border border-dashed border-gray-300">
                  <p className="text-slate-500 text-sm">
                    Chưa có đánh giá nào cho sản phẩm này.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
