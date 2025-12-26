import React from "react";
import { ShoppingBag, CreditCard, Truck, CheckCircle } from "lucide-react"; // Thay đổi icon cho hợp style
import * as Motion from "framer-motion";

export default function UserGuideProPage() {
  const steps = [
    {
      id: "01",
      title: "Lựa chọn sản phẩm",
      description:
        "Khám phá bộ sưu tập mới nhất. Sử dụng bộ lọc thông minh về màu sắc và kích cỡ để tìm item hoàn hảo.",
      icon: <ShoppingBag strokeWidth={1.5} />,
    },
    {
      id: "02",
      title: "Thanh toán an toàn",
      description:
        "Thêm vào giỏ hàng và lựa chọn phương thức thanh toán linh hoạt (COD, Chuyển khoản, Ví điện tử).",
      icon: <CreditCard strokeWidth={1.5} />,
    },
    {
      id: "03",
      title: "Vận chuyển hỏa tốc",
      description:
        "Đơn hàng được xử lý và đóng gói chỉn chu trong vòng 24h. Theo dõi hành trình đơn hàng trực tiếp.",
      icon: <Truck strokeWidth={1.5} />,
    },
    {
      id: "04",
      title: "Trải nghiệm & Đánh giá",
      description:
        "Nhận hàng, thử đồ và chia sẻ trải nghiệm của bạn. Hỗ trợ đổi trả dễ dàng trong 30 ngày.",
      icon: <CheckCircle strokeWidth={1.5} />,
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  return (
    <div className="min-h-screen bg-white pt-[120px] pb-20 px-4 md:px-8 font-sans text-gray-900">
      {/* Header Section */}
      <div className="max-w-3xl mx-auto text-center mb-20">
        <h1 className="text-3xl md:text-5xl font-bold uppercase tracking-tight mb-4">
          Hướng dẫn mua sắm
        </h1>
        <p className="text-gray-500 text-lg">
          Trải nghiệm mua sắm đẳng cấp chỉ với 4 bước đơn giản.
        </p>
      </div>

      {/* Steps Grid */}
      <Motion.motion.div
        className="max-w-screen-xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        {steps.map((step) => (
          <Motion.motion.div
            key={step.id}
            variants={itemVariants}
            className="group p-6 border border-gray-100 rounded-2xl hover:border-gray-300 hover:shadow-xl transition-all duration-300 bg-white"
          >
            <div className="flex items-center justify-between mb-6">
              <span className="text-4xl font-black text-gray-500 group-hover:text-red-500 transition-colors">
                {step.id}
              </span>
              <div className="p-3 bg-gray-50 rounded-full text-gray-900 group-hover:bg-black group-hover:text-white transition-colors">
                {React.cloneElement(step.icon, { size: 24 })}
              </div>
            </div>
            <h3 className="text-xl font-bold mb-3">{step.title}</h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              {step.description}
            </p>
          </Motion.motion.div>
        ))}
      </Motion.motion.div>

      {/* CTA Section */}
      <div className="mt-24 text-center">
        <a
          href="/products"
          className="inline-block px-10 py-4 bg-black text-white font-bold rounded-full hover:bg-red-600 transition-all duration-300 shadow-lg hover:shadow-red-500/30"
        >
          Bắt đầu mua sắm
        </a>
      </div>
    </div>
  );
}
