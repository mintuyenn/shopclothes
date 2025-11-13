// src/pages/MemberPolicyPage.jsx
import React from "react";
import * as Motion from "framer-motion";
import { Star, Gift, Shield, Percent } from "lucide-react";

const policies = [
  {
    icon: <Star size={36} className="text-yellow-500" />,
    title: "Thành viên Vàng",
    description:
      "Nhận ưu đãi 15% cho mọi sản phẩm, quà sinh nhật hàng năm và trải nghiệm VIP tại cửa hàng. Quyền lợi này áp dụng tự động khi đạt mốc điểm thưởng.",
  },
  {
    icon: <Gift size={36} className="text-pink-500" />,
    title: "Quà tặng & Ưu đãi",
    description:
      "Thưởng quà định kỳ, voucher giảm giá, điểm thưởng khi mua sắm và cơ hội tham gia các chương trình giới hạn dành riêng cho thành viên.",
  },
  {
    icon: <Shield size={36} className="text-blue-500" />,
    title: "Bảo mật & An toàn",
    description:
      "Thông tin cá nhân và giao dịch của thành viên được bảo mật tuyệt đối. Hệ thống thanh toán an toàn, được mã hóa chuẩn SSL.",
  },
  {
    icon: <Percent size={36} className="text-green-500" />,
    title: "Ưu đãi đặc biệt",
    description:
      "Nhận mã giảm giá độc quyền, tham gia flash sale trước người khác, và truy cập các sản phẩm giới hạn chỉ dành cho thành viên.",
  },
  {
    icon: <Star size={36} className="text-purple-500" />,
    title: "Tích điểm & Thăng hạng",
    description:
      "Mỗi đơn hàng đều tích lũy điểm thưởng. Khi đạt mốc điểm, bạn có thể thăng hạng thành viên và mở khóa thêm quyền lợi.",
  },
  {
    icon: <Gift size={36} className="text-orange-500" />,
    title: "Sự kiện & Workshop",
    description:
      "Tham gia các sự kiện offline và workshop thời trang do ShopClothes tổ chức, dành riêng cho hội viên tích cực.",
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
  hover: { scale: 1.03, boxShadow: "0px 20px 40px rgba(0,0,0,0.15)" },
};

export default function MemberPolicyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 pt-24 px-6 md:px-16 font-sans">
      {/* Header */}
      <Motion.motion.div
        initial={{ opacity: 0, y: -60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-16"
      >
        <h1 className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-pink-600 mb-6">
          Chính sách thành viên ShopClothes
        </h1>
        <p className="text-gray-700 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
          Trở thành thành viên để trải nghiệm ưu đãi độc quyền, tích điểm mua
          sắm, nhận quà và tham gia các sự kiện VIP. Dưới đây là toàn bộ quyền
          lợi bạn sẽ được hưởng khi đồng hành cùng ShopClothes.
        </p>
      </Motion.motion.div>

      {/* Policies Grid */}
      <Motion.motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        {policies.map((policy, idx) => (
          <Motion.motion.div
            key={idx}
            variants={cardVariants}
            whileHover="hover"
            className="bg-white rounded-2xl p-6 flex flex-col items-center text-center cursor-pointer shadow-md hover:shadow-xl transition"
          >
            <div className="mb-4">{policy.icon}</div>
            <h3 className="text-xl md:text-2xl font-bold mb-3">
              {policy.title}
            </h3>
            <p className="text-gray-600 text-sm md:text-base leading-relaxed">
              {policy.description}
            </p>
          </Motion.motion.div>
        ))}
      </Motion.motion.div>

      {/* Footer note */}
      <Motion.motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="mt-16 text-center max-w-3xl mx-auto text-gray-700 text-base md:text-lg leading-relaxed"
      >
        <p>
          Lưu ý: Quyền lợi thành viên áp dụng dựa trên chính sách và điều kiện
          hiện hành của ShopClothes. ShopClothes có quyền cập nhật và điều chỉnh
          quyền lợi mà không cần thông báo trước. Hãy đăng nhập để theo dõi điểm
          thưởng và trạng thái thành viên của bạn.
        </p>
      </Motion.motion.div>
    </div>
  );
}
