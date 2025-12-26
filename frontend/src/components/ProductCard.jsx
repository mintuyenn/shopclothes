// src/components/ProductCard.jsx
import React, { useState, useEffect } from "react";
import {
  ShoppingCart,
  CheckCircle,
  AlertCircle,
  Star,
  Eye,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

const ProductCard = ({ product, activeVariant = null }) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [selectedVariant, setSelectedVariant] = useState(
    activeVariant || product.variants?.[0] || null
  );

  const [selectedImage, setSelectedImage] = useState(
    activeVariant?.images?.[0] ||
      product.variants?.[0]?.images?.[0] ||
      product.images?.[0] ||
      "/placeholder.png"
  );

  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (activeVariant) {
      setSelectedVariant(activeVariant);
      setSelectedImage(
        activeVariant.images?.[0] || product.images?.[0] || "/placeholder.png"
      );
    }
  }, [activeVariant, product]);

  const getVariantImage = (variant) => {
    if (variant?.images?.length > 0) return variant.images[0];
    if (product.images?.length > 0) return product.images[0];
    return "/placeholder.png";
  };

  const showToast = (text, type = "success") => {
    setToast({ text, type });
    setTimeout(() => setToast(null), 2000);
  };

  const discountedPrice = product.finalPrice ?? product.price;
  const discountInfo = product.discountInfo;

  return (
    <>
      {/* --- TOAST NOTIFICATION (Minimal Style) --- */}
      {toast && (
        <div
          className={`fixed top-24 right-5 px-6 py-4 rounded-lg shadow-2xl flex items-center gap-3 z-[9999] animate-fade-in-down border-l-4 backdrop-blur-md bg-white/95`}
          style={{
            borderColor: toast.type === "success" ? "#10b981" : "#ef4444",
          }}
        >
          {toast.type === "success" ? (
            <CheckCircle size={20} className="text-green-500" />
          ) : (
            <AlertCircle size={20} className="text-red-500" />
          )}
          <span className="text-sm font-semibold text-gray-800">
            {toast.text}
          </span>
        </div>
      )}

      {/* --- CARD CONTAINER --- */}
      <div className="group relative flex flex-col h-full bg-white rounded-xl overflow-hidden transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-transparent hover:border-gray-100">
        {/* 1. IMAGE AREA */}
        <div
          className="relative w-full aspect-[3/4] overflow-hidden bg-gray-100 cursor-pointer"
          onClick={() => navigate(`/product/${product._id}`)}
        >
          <img
            src={selectedImage}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />

          {/* Discount Badge */}
          {discountInfo && (
            <div className="absolute top-2 left-2 bg-red-600 text-white text-[10px] font-bold px-2 py-1 uppercase tracking-wider rounded-sm z-10">
              {discountInfo.type === "percent"
                ? `-${discountInfo.value}%`
                : "SALE"}
            </div>
          )}

          {/* Overlay Actions (Desktop) */}
          <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        {/* 2. INFO AREA */}
        <div className="p-4 flex flex-col flex-grow">
          {/* Variant Selector (Thumbnails) */}
          {product.variants?.length > 1 && (
            <div className="flex gap-2 mb-3 overflow-x-auto no-scrollbar">
              {product.variants.map((variant) => (
                <button
                  key={variant._id}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedVariant(variant);
                    setSelectedImage(getVariantImage(variant));
                  }}
                  className={`w-8 h-8 rounded-full border border-gray-200 overflow-hidden transition-all flex-shrink-0 ${
                    selectedVariant?._id === variant._id
                      ? "ring-1 ring-gray-900 ring-offset-1"
                      : "hover:border-gray-400"
                  }`}
                  title={variant.color}
                >
                  <img
                    src={getVariantImage(variant)}
                    alt={variant.color}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}

          {/* Product Name */}
          <h3
            className="font-medium text-gray-900 text-sm md:text-base line-clamp-2 mb-1 cursor-pointer hover:text-red-600 transition-colors"
            onClick={() => navigate(`/product/${product._id}`)}
          >
            {product.name}{" "}
            {selectedVariant?.color ? `(${selectedVariant.color})` : ""}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1 mb-2">
            <div className="flex text-yellow-400">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={12}
                  fill={
                    i < Math.round(product.averageRating || 5)
                      ? "currentColor"
                      : "none"
                  }
                  className={
                    i < Math.round(product.averageRating || 5)
                      ? ""
                      : "text-gray-300"
                  }
                />
              ))}
            </div>
            <span className="text-xs text-gray-400">
              ({product.reviewCount || 0})
            </span>
          </div>

          {/* Price */}
          <div className="mt-auto flex flex-col items-start gap-1">
            {discountedPrice < product.price ? (
              <div className="flex items-baseline gap-2">
                <span className="text-red-600 font-bold text-base md:text-lg">
                  {discountedPrice.toLocaleString("vi-VN")}đ
                </span>
                <span className="text-gray-400 text-xs md:text-sm line-through decoration-gray-400">
                  {product.price.toLocaleString("vi-VN")}đ
                </span>
              </div>
            ) : (
              <span className="text-gray-900 font-bold text-base md:text-lg">
                {product.price.toLocaleString("vi-VN")}đ
              </span>
            )}
          </div>

          {/* 3. ADD TO CART BUTTON (Minimalist) */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              const token = localStorage.getItem("token");

              if (!token) {
                showToast("Vui lòng đăng nhập!", "error");
                setTimeout(() => navigate("/login?redirect=cart"), 1500);
                return;
              }

              const variant =
                product.variants?.length > 0 ? selectedVariant : null;
              if (product.variants?.length > 0 && !variant) {
                showToast("Vui lòng chọn màu!", "error");
                return;
              }

              const sizeObj =
                variant?.sizes?.length > 0 ? variant.sizes[0] : null;
              const stock =
                sizeObj?.stock ?? variant?.stock ?? product.stock ?? 0;

              if (stock <= 0) {
                showToast("Hết hàng!", "error");
                return;
              }

              addToCart({
                productId: product._id,
                color: variant?.color ?? null,
                size: sizeObj?.size ?? null,
                image: selectedImage,
                quantity: 1,
                price: product.price,
                salePrice: discountedPrice,
              });

              showToast("Đã thêm vào giỏ!", "success");
            }}
            className="w-full mt-4 flex items-center justify-center gap-2 bg-gray-900 text-white text-sm font-bold py-3 rounded-lg hover:bg-red-600 transition-all duration-300 shadow-sm hover:shadow-lg hover:shadow-red-500/20 active:scale-95"
          >
            <ShoppingCart size={16} />
            Thêm vào giỏ
          </button>
        </div>
      </div>
    </>
  );
};

export default ProductCard;
