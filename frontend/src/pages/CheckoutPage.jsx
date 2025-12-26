import React, { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import {
  User,
  Phone,
  MapPin,
  CreditCard,
  Truck,
  Tag,
  ShieldCheck,
  ArrowRight,
  Loader,
  ChevronDown,
  Gift,
  CheckCircle2,
} from "lucide-react";

const CheckoutPage = () => {
  const { cart, totals } = useCart();
  const navigate = useNavigate();
  const API_URL = `${import.meta.env.VITE_API_URL}/api`;

  // --- FORM STATE & ERRORS ---
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
  });
  const [errors, setErrors] = useState({});

  // --- PAYMENT & LOADING ---
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [loading, setLoading] = useState(false);

  // --- VOUCHER STATE ---
  const [voucherCode, setVoucherCode] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [appliedCode, setAppliedCode] = useState(null);
  const [voucherLoading, setVoucherLoading] = useState(false);

  // --- USER COUPONS ---
  const [userCoupons, setUserCoupons] = useState([]);
  const [couponOpen, setCouponOpen] = useState(false);

  // --- Final total
  const finalTotal = Math.max(0, totals.subtotalPrice - appliedDiscount);

  // ==========================================
  // 🛡️ LOGIC VALIDATE FORM
  // ==========================================
  const validateForm = () => {
    let newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Vui lòng nhập họ tên";
    else if (formData.name.trim().length < 2) newErrors.name = "Tên quá ngắn";

    const phoneRegex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/;
    if (!formData.phone.trim()) newErrors.phone = "Vui lòng nhập SĐT";
    else if (!phoneRegex.test(formData.phone))
      newErrors.phone = "SĐT không hợp lệ";

    if (!formData.address.trim()) newErrors.address = "Vui lòng nhập địa chỉ";
    else if (formData.address.trim().length < 10)
      newErrors.address = "Địa chỉ quá ngắn";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: "" });
  };

  // ==========================================
  // 🎁 XỬ LÝ VOUCHER
  // ==========================================
  const handleApplyVoucher = async () => {
    if (!voucherCode.trim()) return;
    setVoucherLoading(true);
    try {
      const { data } = await axios.post(`${API_URL}/discounts/validate`, {
        code: voucherCode,
        subtotal: totals.subtotalPrice,
      });

      if (data.success) {
        setAppliedDiscount(data.discountAmount);
        setAppliedCode(data.code);
        Swal.fire({
          icon: "success",
          title: "Đã áp dụng mã!",
          text: `Giảm trực tiếp ${data.discountAmount.toLocaleString()}đ`,
          confirmButtonColor: "#000",
          timer: 2000,
        });
      }
    } catch (error) {
      setAppliedDiscount(0);
      setAppliedCode(null);
      Swal.fire({
        icon: "error",
        title: "Không thể áp dụng",
        text: error.response?.data?.message || "Mã không hợp lệ",
        confirmButtonColor: "#000",
      });
    } finally {
      setVoucherLoading(false);
    }
  };

  const handleRemoveVoucher = () => {
    setAppliedDiscount(0);
    setAppliedCode(null);
    setVoucherCode("");
  };

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/discounts/latest-holiday`);
        if (data.success) setUserCoupons(data.data);
      } catch (e) {
        console.log("Lỗi load coupon:", e);
      }
    };
    fetchCoupons();
  }, []);

  const handleUseCoupon = (code) => {
    setVoucherCode(code);
    handleApplyVoucher(); // Lưu ý: logic này cần state voucherCode update xong mới chạy, thực tế có thể cần sửa lại chút flow hoặc gọi api luôn với 'code'
    setCouponOpen(false);
  };

  // ==========================================
  // 💳 XỬ LÝ ĐẶT HÀNG
  // ==========================================
  const handlePlaceOrder = async () => {
    if (!validateForm()) {
      Swal.fire({
        icon: "warning",
        title: "Thiếu thông tin",
        text: "Vui lòng điền đầy đủ thông tin giao hàng.",
        confirmButtonColor: "#000",
      });
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };

      const orderData = {
        items: cart.items,
        subtotalPrice: totals.subtotalPrice,
        totalPrice: finalTotal,
        discountAmount: appliedDiscount,
        appliedDiscountCode: appliedCode,
        shippingPrice: 0,
        shippingAddress: formData,
        paymentMethod,
      };

      const { data } = await axios.post(`${API_URL}/orders`, orderData, config);

      if (data.success) {
        if (paymentMethod === "COD") {
          Swal.fire({
            icon: "success",
            title: "Đặt hàng thành công!",
            text: "Cảm ơn bạn đã mua sắm.",
            confirmButtonColor: "#000",
          }).then(() => navigate(`/order-detail/${data.order._id}`));
        } else if (paymentMethod === "VNPAY" && data.paymentUrl) {
          window.location.href = data.paymentUrl;
        }
      }
    } catch (error) {
      console.error(error);
      Swal.fire({
        title: "Lỗi đặt hàng",
        text: error.response?.data?.message || "Có lỗi xảy ra",
        icon: "error",
        confirmButtonColor: "#000",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!cart.items || cart.items.length === 0)
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-gray-500 bg-gray-50">
        <p className="text-2xl font-bold mb-4 text-gray-900">
          Giỏ hàng đang trống
        </p>
        <button
          onClick={() => navigate("/products")}
          className="text-white bg-black px-6 py-2 rounded-full hover:bg-gray-800 transition"
        >
          Quay lại mua sắm
        </button>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 md:px-8 font-sans">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-black text-gray-900 mb-8 uppercase tracking-tight text-center md:text-left">
          Thanh toán
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* === LEFT COLUMN: FORM & PAYMENT === */}
          <div className="lg:col-span-7 space-y-8">
            {/* 1. THÔNG TIN GIAO HÀNG */}
            <section className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
                <MapPin size={22} className="text-gray-900" />
                <h2 className="text-xl font-bold text-gray-900 uppercase tracking-wide">
                  Địa chỉ nhận hàng
                </h2>
              </div>

              <div className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Tên */}
                  <div className="relative">
                    <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1 block">
                      Họ và tên
                    </label>
                    <div className="relative">
                      <User
                        size={18}
                        className="absolute left-3 top-3 text-gray-400"
                      />
                      <input
                        type="text"
                        name="name"
                        placeholder="VD: Nguyễn Văn A"
                        className={`w-full pl-10 pr-4 py-2.5 rounded-lg border bg-gray-50 focus:bg-white outline-none transition-all ${
                          errors.name
                            ? "border-red-500 focus:border-red-500"
                            : "border-gray-200 focus:border-black focus:ring-1 focus:ring-black"
                        }`}
                        value={formData.name}
                        onChange={handleInputChange}
                      />
                    </div>
                    {errors.name && (
                      <p className="text-red-500 text-xs mt-1 font-medium">
                        {errors.name}
                      </p>
                    )}
                  </div>

                  {/* SĐT */}
                  <div className="relative">
                    <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1 block">
                      Số điện thoại
                    </label>
                    <div className="relative">
                      <Phone
                        size={18}
                        className="absolute left-3 top-3 text-gray-400"
                      />
                      <input
                        type="text"
                        name="phone"
                        placeholder="VD: 0987654321"
                        className={`w-full pl-10 pr-4 py-2.5 rounded-lg border bg-gray-50 focus:bg-white outline-none transition-all ${
                          errors.phone
                            ? "border-red-500 focus:border-red-500"
                            : "border-gray-200 focus:border-black focus:ring-1 focus:ring-black"
                        }`}
                        value={formData.phone}
                        onChange={handleInputChange}
                      />
                    </div>
                    {errors.phone && (
                      <p className="text-red-500 text-xs mt-1 font-medium">
                        {errors.phone}
                      </p>
                    )}
                  </div>
                </div>

                {/* Địa chỉ */}
                <div>
                  <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1 block">
                    Địa chỉ chi tiết
                  </label>
                  <div className="relative">
                    <MapPin
                      size={18}
                      className="absolute left-3 top-3.5 text-gray-400"
                    />
                    <textarea
                      name="address"
                      rows={2}
                      placeholder="Số nhà, tên đường, phường/xã, quận/huyện..."
                      className={`w-full pl-10 pr-4 py-3 rounded-lg border bg-gray-50 focus:bg-white outline-none transition-all resize-none ${
                        errors.address
                          ? "border-red-500 focus:border-red-500"
                          : "border-gray-200 focus:border-black focus:ring-1 focus:ring-black"
                      }`}
                      value={formData.address}
                      onChange={handleInputChange}
                    />
                  </div>
                  {errors.address && (
                    <p className="text-red-500 text-xs mt-1 font-medium">
                      {errors.address}
                    </p>
                  )}
                </div>
              </div>
            </section>

            {/* 2. PHƯƠNG THỨC THANH TOÁN */}
            <section className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
                <CreditCard size={22} className="text-gray-900" />
                <h2 className="text-xl font-bold text-gray-900 uppercase tracking-wide">
                  Phương thức thanh toán
                </h2>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {/* Option 1: COD */}
                <div
                  onClick={() => setPaymentMethod("COD")}
                  className={`relative flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                    paymentMethod === "COD"
                      ? "border-black bg-gray-50 ring-1 ring-black"
                      : "border-gray-100 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-white border border-gray-200 text-gray-700 mr-4 shadow-sm">
                    <Truck size={24} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-gray-900">
                        Thanh toán khi nhận hàng (COD)
                      </span>
                      {paymentMethod === "COD" && (
                        <CheckCircle2
                          size={20}
                          className="text-black fill-current"
                        />
                      )}
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      Bạn chỉ phải thanh toán khi đã nhận được hàng
                    </p>
                  </div>
                </div>

                {/* Option 2: VNPAY */}
                <div
                  onClick={() => setPaymentMethod("VNPAY")}
                  className={`relative flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                    paymentMethod === "VNPAY"
                      ? "border-black bg-gray-50 ring-1 ring-black"
                      : "border-gray-100 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-white border border-gray-200 p-1 mr-4 shadow-sm">
                    <img
                      src="https://vnpay.vn/s1/statics.vnpay.vn/2023/9/06ncktiwd6dc1694418196384.png"
                      alt="VNPAY"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-gray-900">
                        Thanh toán qua VNPAY
                      </span>
                      {paymentMethod === "VNPAY" && (
                        <CheckCircle2
                          size={20}
                          className="text-black fill-current"
                        />
                      )}
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      Quét mã QR từ ứng dụng ngân hàng
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* === RIGHT COLUMN: ORDER SUMMARY === */}
          <div className="lg:col-span-5">
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-xl shadow-gray-200/60 border border-gray-100 sticky top-8">
              <h3 className="text-lg font-bold text-gray-900 mb-6 uppercase tracking-wider flex items-center gap-2 border-b border-gray-100 pb-4">
                Đơn hàng của bạn{" "}
                <span className="bg-black text-white text-xs px-2 py-0.5 rounded-full ml-auto">
                  {cart.items.length} món
                </span>
              </h3>

              {/* Product List */}
              <div className="space-y-4 mb-8 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                {cart.items.map((item) => (
                  <div
                    key={item.productId}
                    className="flex gap-4 items-start group"
                  >
                    <div className="relative shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-20 object-cover rounded-md border border-gray-200"
                      />
                      <span className="absolute -top-2 -right-2 bg-gray-900 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-md border-2 border-white">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 text-sm line-clamp-2 mb-1">
                        {item.name}
                      </h4>
                      <p className="text-gray-500 text-xs mb-1">
                        {item.color} / {item.size}
                      </p>
                    </div>
                    <div className="text-sm font-bold text-gray-900">
                      {(
                        (item.salePrice || item.price) * item.quantity
                      ).toLocaleString()}
                      đ
                    </div>
                  </div>
                ))}
              </div>

              {/* Voucher Input */}
              <div className="mb-6 bg-gray-50 p-4 rounded-xl border border-gray-200/60">
                {!appliedCode ? (
                  <>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Tag
                          size={16}
                          className="absolute left-3 top-3 text-gray-400"
                        />
                        <input
                          type="text"
                          value={voucherCode}
                          onChange={(e) =>
                            setVoucherCode(e.target.value.toUpperCase())
                          }
                          placeholder="Mã giảm giá"
                          className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-gray-200 text-sm font-medium uppercase placeholder:normal-case focus:border-black focus:ring-1 focus:ring-black outline-none"
                        />
                      </div>
                      <button
                        onClick={handleApplyVoucher}
                        disabled={voucherLoading || !voucherCode}
                        className="bg-black text-white px-5 rounded-lg text-sm font-bold hover:bg-gray-800 disabled:bg-gray-300 transition-colors"
                      >
                        {voucherLoading ? (
                          <Loader size={16} className="animate-spin" />
                        ) : (
                          "ÁP DỤNG"
                        )}
                      </button>
                    </div>

                    {/* Toggle User Coupons */}
                    <button
                      onClick={() => setCouponOpen(!couponOpen)}
                      className="mt-3 text-xs font-bold text-gray-600 flex items-center gap-1 hover:text-black transition-colors"
                    >
                      <Gift size={14} /> Chọn mã ưu đãi có sẵn{" "}
                      <ChevronDown
                        size={14}
                        className={`transition-transform ${
                          couponOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {/* Dropdown User Coupons */}
                    {couponOpen && (
                      <div className="mt-3 space-y-2 animate-fade-in-down">
                        {userCoupons.length === 0 ? (
                          <p className="text-xs text-gray-400 italic">
                            Bạn không có mã giảm giá nào.
                          </p>
                        ) : (
                          userCoupons.map((c) => (
                            <div
                              key={c._id}
                              onClick={() => {
                                setVoucherCode(c.code);
                                handleUseCoupon(c.code);
                              }}
                              className="flex justify-between items-center p-3 bg-white border border-gray-200 rounded-lg cursor-pointer hover:border-black transition-colors group"
                            >
                              <div>
                                <p className="font-bold text-xs text-gray-900">
                                  {c.code}
                                </p>
                                <p className="text-[10px] text-gray-500">
                                  Giảm{" "}
                                  {c.discountType === "holiday"
                                    ? `${c.discountValue}đ`
                                    : `${c.discountValue}%`}
                                </p>
                              </div>
                              <div className="text-[10px] font-bold text-gray-400 group-hover:text-black uppercase border border-gray-200 group-hover:border-black px-2 py-1 rounded transition-colors">
                                Dùng
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="flex items-center justify-between bg-green-50 border border-green-200 p-3 rounded-lg">
                    <div className="flex items-center gap-2">
                      <ShieldCheck size={18} className="text-green-600" />
                      <div>
                        <p className="text-xs font-bold text-green-700">
                          Đã dùng mã: {appliedCode}
                        </p>
                        <p className="text-[10px] text-green-600">
                          Tiết kiệm {appliedDiscount.toLocaleString()}đ
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={handleRemoveVoucher}
                      className="text-xs font-bold text-gray-400 hover:text-red-600 transition-colors"
                    >
                      Gỡ bỏ
                    </button>
                  </div>
                )}
              </div>

              {/* Pricing Totals */}
              <div className="space-y-3 pt-4 border-t border-gray-100 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Tạm tính</span>
                  <span className="font-medium text-gray-900">
                    {totals.subtotalPrice.toLocaleString()}đ
                  </span>
                </div>
                {appliedDiscount > 0 && (
                  <div className="flex justify-between text-green-600 bg-green-50 px-2 py-1 rounded">
                    <span>Giảm giá voucher</span>
                    <span className="font-bold">
                      - {appliedDiscount.toLocaleString()}đ
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Phí vận chuyển</span>
                  <span className="font-medium text-gray-900">Miễn phí</span>
                </div>
              </div>

              <div className="flex justify-between items-end border-t border-gray-200 pt-6 mt-6">
                <span className="font-bold text-gray-900 text-lg">
                  Tổng cộng
                </span>
                <div className="text-right">
                  <span className="block text-3xl font-black text-red-600 leading-none">
                    {finalTotal.toLocaleString()}đ
                  </span>
                  <span className="text-[10px] text-gray-400 font-medium uppercase mt-1 block">
                    Đã bao gồm VAT
                  </span>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={handlePlaceOrder}
                disabled={loading}
                className="w-full mt-8 bg-black hover:bg-red-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-red-500/30 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed group flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader size={20} className="animate-spin" /> Đang xử lý...
                  </>
                ) : (
                  <>
                    {paymentMethod === "VNPAY" ? "THANH TOÁN NGAY" : "ĐẶT HÀNG"}
                    <ArrowRight
                      size={20}
                      className="group-hover:translate-x-1 transition-transform"
                    />
                  </>
                )}
              </button>

              <div className="mt-4 text-center">
                <p className="text-[10px] text-gray-400 flex items-center justify-center gap-1">
                  <ShieldCheck size={12} /> Thông tin của bạn được bảo mật tuyệt
                  đối
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
