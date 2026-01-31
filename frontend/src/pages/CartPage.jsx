import React from "react";
import { useCart } from "../context/CartContext";
import { Link, useNavigate } from "react-router-dom";
import {
  Trash2,
  Minus,
  Plus,
  ArrowRight,
  ShoppingBag,
  ShieldCheck,
  Truck,
  ArrowLeft,
} from "lucide-react";
import Swal from "sweetalert2";

const CartPage = () => {
  const {
    cart = { items: [] },
    updateCart,
    removeFromCart,
    totals = {},
  } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      Swal.fire({
        icon: "info",
        title: "Đăng nhập để tiếp tục",
        text: "Bạn cần đăng nhập để tích điểm và thanh toán dễ dàng hơn!",
        confirmButtonColor: "#000",
        confirmButtonText: "Đăng nhập ngay",
        showCancelButton: true,
        cancelButtonText: "Để sau",
        focusCancel: true,
      }).then((result) => {
        if (result.isConfirmed) navigate("/login?redirect=checkout");
      });
      return;
    }
    navigate("/checkout");
  };

  // --- EMPTY STATE (GIỎ HÀNG TRỐNG) ---
  if (!cart.items.length) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 bg-gray-50">
        <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-lg mb-6 animate-fade-in-up">
          <ShoppingBag size={40} className="text-gray-300" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-3 tracking-tight">
          Giỏ hàng của bạn đang trống
        </h2>
        <p className="text-gray-500 mb-8 max-w-md">
          Có vẻ như bạn chưa chọn được món đồ yêu thích nào. Hãy khám phá bộ sưu
          tập mới nhất của chúng tôi nhé!
        </p>
        <Link
          to="/products"
          className="group flex items-center gap-2 px-8 py-3.5 bg-black text-white rounded-full hover:bg-red-600 transition-all duration-300 font-bold shadow-xl hover:shadow-red-500/20"
        >
          Khám phá ngay{" "}
          <ArrowRight
            size={18}
            className="group-hover:translate-x-1 transition-transform"
          />
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans py-12">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        {/* PAGE HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 border-b border-gray-200 pb-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight">
              Giỏ hàng
            </h1>
            <p className="text-gray-500 mt-2 text-sm">
              Bạn đang có{" "}
              <span className="font-bold text-gray-900">
                {cart.items.length}
              </span>{" "}
              sản phẩm trong giỏ
            </p>
          </div>
          <Link
            to="/products"
            className="hidden md:flex items-center text-sm font-semibold text-gray-600 hover:text-black transition-colors mt-4 md:mt-0"
          >
            <ArrowLeft size={16} className="mr-1" /> Tiếp tục mua sắm
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* --- LEFT COLUMN: ITEM LIST --- */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              {/* Header Row (Hidden on Mobile) */}
              <div className="hidden sm:grid grid-cols-12 gap-4 p-4 bg-gray-50 border-b border-gray-100 text-xs font-bold text-gray-500 uppercase tracking-wider">
                <div className="col-span-6">Sản phẩm</div>
                <div className="col-span-3 text-center">Số lượng</div>
                <div className="col-span-3 text-right">Tạm tính</div>
              </div>

              <div className="divide-y divide-gray-100">
                {cart.items.map((item) => {
                  const {
                    price = 0,
                    salePrice = 0,
                    quantity = 1,
                    subtotal = 0,
                  } = item;
                  const isDiscounted = salePrice < price;

                  return (
                    <div
                      key={item._id}
                      className="p-4 sm:p-6 hover:bg-gray-50 transition-colors duration-200"
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
                        {/* 1. INFO & IMAGE */}
                        <div className="sm:col-span-6 flex gap-4">
                          <Link
                            to={`/product/${item.productId}`}
                            className="shrink-0 relative group overflow-hidden rounded-lg border border-gray-200 w-24 h-32"
                          >
                            <img
                              src={item.image || "/placeholder.png"}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                              alt={item.name}
                            />
                          </Link>

                          <div className="flex flex-col justify-between py-1">
                            <div>
                              <Link to={`/product/${item.productId}`}>
                                <h3 className="font-bold text-gray-900 hover:text-red-600 transition-colors line-clamp-2 mb-1">
                                  {item.name}
                                </h3>
                              </Link>
                              <div className="text-sm text-gray-500 space-y-1">
                                {item.color && (
                                  <p>
                                    Màu:{" "}
                                    <span className="text-gray-900 font-medium">
                                      {item.color}
                                    </span>
                                  </p>
                                )}
                                {item.size && (
                                  <p>
                                    Size:{" "}
                                    <span className="text-gray-900 font-medium">
                                      {item.size}
                                    </span>
                                  </p>
                                )}
                              </div>
                            </div>

                            {/* Mobile Price Display */}
                            <div className="sm:hidden mt-2">
                              {isDiscounted ? (
                                <div className="flex items-center gap-2">
                                  <span className="font-bold text-gray-900">
                                    {salePrice.toLocaleString()}đ
                                  </span>
                                  <span className="text-xs text-gray-400 line-through">
                                    {price.toLocaleString()}đ
                                  </span>
                                </div>
                              ) : (
                                <span className="font-bold text-gray-900">
                                  {price.toLocaleString()}đ
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* 2. QUANTITY SELECTOR */}
                        <div className="sm:col-span-3 flex justify-start sm:justify-center">
                          <div className="flex items-center border border-gray-300 rounded-full h-10 w-fit bg-white">
                            <button
                              onClick={() =>
                                updateCart({
                                  ...item,
                                  quantity: Math.max(1, quantity - 1),
                                })
                              }
                              disabled={quantity <= 1}
                              className="w-10 h-full flex items-center justify-center text-gray-500 hover:text-black disabled:opacity-30 transition"
                            >
                              <Minus size={14} />
                            </button>
                            <span className="w-8 text-center font-semibold text-sm text-gray-900">
                              {quantity}
                            </span>
                            <button
                              onClick={() =>
                                updateCart({ ...item, quantity: quantity + 1 })
                              }
                              className="w-10 h-full flex items-center justify-center text-gray-500 hover:text-black transition"
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                        </div>

                        {/* 3. SUBTOTAL & ACTIONS */}
                        <div className="sm:col-span-3 flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 sm:gap-1 mt-4 sm:mt-0 pt-4 sm:pt-0 border-t sm:border-t-0 border-gray-100">
                          {/* Desktop Price info */}
                          <div className="text-right">
                            <div className="text-base font-bold text-red-600">
                              {subtotal.toLocaleString()}đ
                            </div>
                            {quantity > 1 && (
                              <div className="text-xs text-gray-400 mt-1">
                                {salePrice.toLocaleString()}đ / cái
                              </div>
                            )}
                          </div>

                          {/* Remove Button */}
                          <button
                            onClick={() =>
                              removeFromCart({
                                productId: item.productId,
                                color: item.color,
                                size: item.size,
                              })
                            }
                            className="group flex items-center gap-1 text-xs text-gray-400 hover:text-red-500 transition-colors mt-2"
                          >
                            <Trash2
                              size={14}
                              className="group-hover:scale-110 transition-transform"
                            />
                            <span className="underline decoration-transparent group-hover:decoration-red-500">
                              Xóa
                            </span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <Link
              to="/products"
              className="md:hidden flex items-center justify-center text-sm font-semibold text-gray-600 mt-6"
            >
              ← Tiếp tục mua sắm
            </Link>
          </div>

          {/* --- RIGHT COLUMN: SUMMARY --- */}
          <div className="lg:col-span-4 h-fit sticky top-24">
            <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 p-6 md:p-8">
              <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                Tóm tắt đơn hàng
              </h3>

              {/* Summary Lines */}
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-600 text-sm">
                  <span>Tạm tính</span>
                  <span className="font-medium text-gray-900">
                    {totals.totalPrice?.toLocaleString()}đ
                  </span>
                </div>

                {totals.discountAmount > 0 && (
                  <div className="flex justify-between text-green-600 text-sm bg-green-50 p-2 rounded-lg">
                    <span>Đã giảm</span>
                    <span className="font-bold">
                      - {totals.discountAmount.toLocaleString()}đ
                    </span>
                  </div>
                )}

                <div className="flex justify-between text-gray-600 text-sm">
                  <span>Phí vận chuyển</span>
                  <span className="text-xs text-gray-400">
                    (Tính ở bước thanh toán)
                  </span>
                </div>

                <div className="border-t border-gray-100 pt-4 flex justify-between items-end">
                  <span className="font-bold text-gray-900 text-lg">
                    Tổng cộng
                  </span>
                  <div className="text-right">
                    <span className="block text-2xl font-black text-red-600">
                      {totals.totalPrice?.toLocaleString()}đ
                    </span>
                    <span className="text-xs text-gray-400 block mt-1">
                      Đã bao gồm VAT
                    </span>
                  </div>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={handleCheckout}
                className="w-full bg-gray-900 text-white py-4 rounded-xl font-bold text-lg hover:bg-red-600 transition-all duration-300 shadow-lg hover:shadow-red-500/30 flex items-center justify-center gap-2 group"
              >
                Thanh toán{" "}
                <ArrowRight
                  size={20}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </button>

              {/* Trust Badges Mini */}
              <div className="mt-8 grid grid-cols-2 gap-4">
                <div className="flex flex-col items-center text-center gap-2 p-3 bg-gray-50 rounded-lg">
                  <ShieldCheck size={20} className="text-gray-400" />
                  <span className="text-[10px] font-semibold text-gray-600 uppercase">
                    Bảo mật 100%
                  </span>
                </div>
                <div className="flex flex-col items-center text-center gap-2 p-3 bg-gray-50 rounded-lg">
                  <Truck size={20} className="text-gray-400" />
                  <span className="text-[10px] font-semibold text-gray-600 uppercase">
                    Giao nhanh
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
