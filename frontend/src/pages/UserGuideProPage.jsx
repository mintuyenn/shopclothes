import React from "react";
import { ShoppingCart, CreditCard, Truck, Smile } from "lucide-react";
import * as Motion from "framer-motion";

export default function UserGuideProPage() {
  const steps = [
    {
      id: 1,
      title: "Chọn sản phẩm yêu thích",
      description:
        "Duyệt qua gian hàng, lọc theo màu sắc, size và giá cả để tìm sản phẩm phù hợp với bạn.",
      icon: <ShoppingCart className="h-10 w-10 text-red-500" />,
    },
    {
      id: 2,
      title: "Thêm vào giỏ hàng & thanh toán",
      description:
        "Thêm sản phẩm vào giỏ, chọn số lượng, kiểm tra lại và thanh toán nhanh chóng bằng nhiều phương thức.",
      icon: <CreditCard className="h-10 w-10 text-blue-500" />,
    },
    {
      id: 3,
      title: "Theo dõi đơn hàng",
      description:
        "Nhận thông báo trực tiếp về trạng thái đơn hàng, từ lúc xác nhận đến giao hàng.",
      icon: <Truck className="h-10 w-10 text-yellow-500" />,
    },
    {
      id: 4,
      title: "Nhận sản phẩm & trải nghiệm",
      description:
        "Nhận hàng tận nơi hoặc tại cửa hàng, thử đồ, cảm nhận chất liệu và tận hưởng trải nghiệm mua sắm.",
      icon: <Smile className="h-10 w-10 text-green-500" />,
    },
  ];

  const containerVariants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.2 },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  return (
    <div className="min-h-screen bg-yellow-50 pt-24 px-4 sm:px-12 font-['Inter',sans-serif]">
      {/* Header */}
      <div className="text-center mb-16">
        <h1 className="text-5xl sm:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-pink-600 to-purple-600 mb-6 animate-pulse">
          Hướng dẫn mua sắm tại ShopClothes
        </h1>
        <p className="text-gray-700 text-lg sm:text-xl max-w-3xl mx-auto">
          Làm theo các bước dưới đây để có trải nghiệm mua sắm{" "}
          <strong>tiện lợi, nhanh chóng và thú vị</strong>.
        </p>
      </div>

      {/* Steps Timeline */}
      <Motion.motion.div
        className="relative max-w-5xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <div className="absolute left-1/2 transform -translate-x-1/2 h-full border-l-4 border-gray-300"></div>
        {steps.map((step, idx) => (
          <Motion.motion.div
            key={step.id}
            variants={cardVariants}
            className={`mb-16 flex w-full ${
              idx % 2 === 0 ? "justify-start" : "justify-end"
            }`}
          >
            <div className="w-full md:w-1/2 relative">
              <div
                className={`absolute -left-10 md:left-auto md:-right-10 top-0 bg-white rounded-full p-2 shadow-lg flex items-center justify-center`}
                style={{ zIndex: 10 }}
              >
                {step.icon}
              </div>
              <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 hover:shadow-2xl transition duration-500 transform hover:scale-105">
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-700">{step.description}</p>
              </div>
            </div>
          </Motion.motion.div>
        ))}
      </Motion.motion.div>

      {/* Call-to-Action */}
      <div className="mt-20 text-center bg-gradient-to-r from-red-500 via-pink-600 to-purple-600 text-white py-16 rounded-3xl shadow-2xl relative overflow-hidden">
        <h2 className="text-4xl font-extrabold mb-4 animate-pulse">
          Bắt đầu mua sắm ngay!
        </h2>
        <p className="max-w-2xl mx-auto mb-8 text-lg">
          Ghé thăm ShopClothes, lựa chọn sản phẩm yêu thích và cảm nhận sự khác
          biệt trong trải nghiệm mua sắm.
        </p>
        <a
          href="/products"
          className="inline-block px-8 py-4 font-bold rounded-xl bg-white text-red-600 hover:bg-gray-100 transition shadow-lg hover:shadow-xl"
        >
          Xem sản phẩm
        </a>
      </div>
    </div>
  );
}
