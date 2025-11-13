import React from "react";
import { useCart } from "../context/CartContext";
import { Link, useNavigate } from "react-router-dom";
import { Trash2 } from "lucide-react";

const CartPage = () => {
  const { cart, updateCart, removeFromCart } = useCart();
  const navigate = useNavigate();

  // Nếu giỏ hàng trống
  if (!cart.items?.length)
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold mb-4">
          🛒 Giỏ hàng của bạn đang trống
        </h2>
        <Link
          className="px-6 py-3 bg-black text-white rounded-xl hover:bg-gray-800 transition"
          to="/products"
        >
          Mua sắm ngay để nhận nhiều ưu đãi!
        </Link>
      </div>
    );

  // ======= TÍNH TOÁN =======

  // Tổng giá gốc (price * qty)
  const subtotalOriginal = cart.items.reduce(
    (sum, it) => sum + (Number(it.price) || 0) * (Number(it.quantity) || 0),
    0
  );

  // Tổng sau giảm giá item (salePrice * qty)
  const subtotalAfterItemSale = cart.items.reduce(
    (sum, it) =>
      sum +
      (Number(it.salePrice ?? it.price) || 0) * (Number(it.quantity) || 0),
    0
  );

  // Chênh lệch giữa giá gốc và giá sale → giảm giá thực tế
  const itemSaleDiscount = Math.max(
    0,
    subtotalOriginal - subtotalAfterItemSale
  );

  // Thành tiền cuối cùng = tổng sau giảm từng item
  const finalTotal = subtotalAfterItemSale;

  // ======= JSX =======

  return (
    <div className="max-w-7xl mx-auto py-10 px-4">
      {/* HEADER */}
      <div className="bg-red-50 border border-red-200 px-6 py-5 rounded-2xl mb-10 shadow-sm">
        <h1 className="text-3xl font-bold text-red-600 flex items-center gap-2">
          🛒 Giỏ hàng của bạn
        </h1>
        <p className="text-red-500 mt-1">
          Mua hàng ngay hôm nay để nhận nhiều ưu đãi nhé!
        </p>
        <div className="mt-4 w-full border-b border-red-200"></div>
      </div>

      {/* LAYOUT GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* LEFT - CART ITEMS */}
        <div className="md:col-span-2 space-y-4">
          {cart.items.map((item) => {
            const itemPrice = Number(item.price) || 0;
            const itemSale = Number(item.salePrice ?? item.price) || 0;
            const itemQty = Number(item.quantity) || 0;
            const itemSubtotal = itemSale * itemQty;

            return (
              <div
                key={`${item.productId}-${item.color}-${item.size}`}
                className="flex p-5 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition"
              >
                {/* IMAGE */}
                <img
                  src={item.image || item.productId?.image || "/no-image.png"}
                  className="w-28 h-32 object-cover rounded-xl border"
                  alt={item.name}
                />

                {/* INFO */}
                <div className="flex flex-col flex-1 ml-5 justify-between">
                  <div>
                    <h3 className="font-semibold text-lg">{item.name}</h3>

                    {(item.color || item.size) && (
                      <p className="text-sm text-gray-500 mt-1">
                        {item.color && `Màu: ${item.color}`}
                        {item.color && item.size && " • "}
                        {item.size && `Size: ${item.size}`}
                      </p>
                    )}

                    {/* PRICE INFO */}
                    <div className="mt-3">
                      {itemSale < itemPrice ? (
                        <div className="flex items-center gap-2">
                          <span className="text-red-600 font-semibold text-lg">
                            {itemSale.toLocaleString()}đ
                          </span>
                          <span className="text-gray-400 line-through">
                            {itemPrice.toLocaleString()}đ
                          </span>
                          <span className="bg-red-100 text-red-600 px-2 py-0.5 rounded text-xs font-medium">
                            -
                            {Math.round(
                              ((itemPrice - itemSale) / itemPrice) * 100
                            )}
                            %
                          </span>
                        </div>
                      ) : (
                        <span className="text-lg font-semibold">
                          {itemPrice.toLocaleString()}đ
                        </span>
                      )}
                    </div>
                  </div>

                  {/* QUANTITY + DELETE */}
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center bg-gray-100 rounded-full px-3 py-1">
                      <button
                        className="px-2 py-1 rounded-full hover:bg-gray-200"
                        onClick={() =>
                          updateCart({
                            productId: item.productId,
                            color: item.color,
                            size: item.size,
                            quantity: Math.max(1, item.quantity - 1),
                          })
                        }
                      >
                        -
                      </button>
                      <span className="px-3 font-semibold">
                        {item.quantity}
                      </span>
                      <button
                        className="px-2 py-1 rounded-full hover:bg-gray-200"
                        onClick={() =>
                          updateCart({
                            productId: item.productId,
                            color: item.color,
                            size: item.size,
                            quantity: item.quantity + 1,
                          })
                        }
                      >
                        +
                      </button>
                    </div>

                    <div className="text-right">
                      <p className="text-red-600 font-bold text-lg">
                        {itemSubtotal.toLocaleString()}đ
                      </p>
                    </div>

                    <button
                      onClick={() =>
                        removeFromCart({
                          productId: item.productId,
                          color: item.color,
                          size: item.size,
                        })
                      }
                      className="text-gray-400 hover:text-red-600 transition ml-4"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* RIGHT - SUMMARY */}
        <div className="bg-white border border-gray-100 shadow-sm rounded-2xl p-6 sticky top-5 h-fit">
          <h3 className="text-xl font-bold mb-4">Tổng đơn hàng</h3>

          <div className="space-y-3 text-gray-700">
            <p className="flex justify-between">
              <span>Tạm tính:</span>
              <span>{subtotalOriginal.toLocaleString()}đ</span>
            </p>

            <p className="flex justify-between">
              <span>Giảm giá (item):</span>
              <span className="text-green-600 font-medium">
                - {itemSaleDiscount.toLocaleString()}đ
              </span>
            </p>

            <hr className="my-3" />

            <p className="flex justify-between text-xl font-bold text-red-600">
              <span>Thành tiền</span>
              <span>{finalTotal.toLocaleString()}đ</span>
            </p>
          </div>

          <button
            onClick={() => navigate("/checkout")}
            className="w-full bg-black text-white py-3 rounded-xl mt-6 hover:bg-gray-800 transition text-lg font-medium"
          >
            Tiến hành thanh toán
          </button>

          <Link
            to="/products"
            className="block w-full text-center border py-3 rounded-xl mt-4 hover:bg-gray-50 transition font-medium"
          >
            Tiếp tục mua hàng
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
