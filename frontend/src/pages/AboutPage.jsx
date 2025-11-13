// src/pages/AboutPage.jsx
import React from "react";
import * as Motion from "framer-motion";

const sections = [
  {
    title: "Về ShopClothes",
    text: `ShopClothes ra đời với sứ mệnh mang đến trải nghiệm mua sắm trực tuyến
           tiện lợi, chất lượng và phong cách. Chúng tôi luôn lựa chọn những sản phẩm
           chất liệu cao cấp, hợp xu hướng thời trang mới nhất, đáp ứng mọi nhu cầu của khách hàng.`,
    img: "https://cdn.hpdecor.vn/wp-content/uploads/2022/05/thiet-ke-shop-quan-ao-nam-1.jpeg",
    reverse: false,
  },
  {
    title: "Chất lượng và uy tín",
    text: `Chúng tôi cam kết mọi sản phẩm đều được kiểm tra kỹ lưỡng trước khi đưa ra thị trường.
           Khách hàng có thể yên tâm về chất lượng, chính sách đổi trả minh bạch, và dịch vụ chăm sóc
           khách hàng tận tâm.`,
    img: "https://xaydungthuanphuoc.com/wp-content/uploads/2022/09/1501_chinh-hang.jpg",
    reverse: true,
  },
  {
    title: "Đội ngũ chuyên nghiệp",
    text: `Đội ngũ ShopClothes luôn sẵn sàng tư vấn, hỗ trợ khách hàng. 
           Với sự nhiệt huyết và kinh nghiệm, chúng tôi mang đến dịch vụ chu đáo, 
           tư vấn phong cách và xu hướng thời trang phù hợp với từng cá nhân.`,
    img: "https://giakethoitrang.com/img/image/Top-5-dia-chi-mua-quan-ao-ngon-bo-re-cho-sinh-vien-Ha-Noi.jpg",
    reverse: false,
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.2 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  hover: { scale: 1.02, transition: { duration: 0.3 } },
};

export default function AboutPage() {
  return (
    <div className="pt-24 bg-gray-50 min-h-screen px-6 md:px-12 font-sans">
      {/* Header */}
      <Motion.motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-16"
      >
        <h1 className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-pink-600 mb-4">
          Giới thiệu ShopClothes
        </h1>
        <p className="text-gray-700 text-lg md:text-xl max-w-3xl mx-auto">
          Chúng tôi kết hợp thời trang, chất lượng và dịch vụ khách hàng hoàn
          hảo để mang đến trải nghiệm mua sắm đáng nhớ.
        </p>
      </Motion.motion.div>

      {/* Sections */}
      <Motion.motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="flex flex-col gap-20"
      >
        {sections.map((section, idx) => (
          <Motion.motion.div
            key={idx}
            variants={itemVariants}
            whileHover="hover"
            className={`flex flex-col md:flex-row items-center gap-8 ${
              section.reverse ? "md:flex-row-reverse" : ""
            }`}
          >
            <div className="md:w-1/2">
              <img
                src={section.img}
                alt={section.title}
                className="rounded-3xl shadow-lg object-cover w-full h-80 md:h-96 hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="md:w-1/2">
              <h2 className="text-3xl md:text-4xl font-bold text-red-600 mb-4">
                {section.title}
              </h2>
              <p className="text-gray-700 text-lg md:text-xl leading-relaxed">
                {section.text}
              </p>
            </div>
          </Motion.motion.div>
        ))}
      </Motion.motion.div>

      {/* CTA Section */}
      <Motion.motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="mt-20 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-3xl p-12 text-center shadow-xl"
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Khám phá ngay ShopClothes
        </h2>
        <p className="mb-6 text-lg md:text-xl max-w-2xl mx-auto">
          Trải nghiệm mua sắm trực tuyến cùng chúng tôi và nhận những ưu đãi hấp
          dẫn, sản phẩm chất lượng, dịch vụ tận tâm.
        </p>
      </Motion.motion.div>
    </div>
  );
}
