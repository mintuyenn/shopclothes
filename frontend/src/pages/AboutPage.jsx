// src/pages/AboutPage.jsx
import React from "react";
import * as Motion from "framer-motion";
import { Users, Award, Globe, Heart } from "lucide-react";

// --- DỮ LIỆU ---
const sections = [
  {
    title: "Về ShopClothes",
    text: `ShopClothes ra đời với sứ mệnh mang đến trải nghiệm mua sắm trực tuyến tiện lợi, chất lượng và phong cách. Chúng tôi luôn lựa chọn những sản phẩm chất liệu cao cấp, hợp xu hướng thời trang mới nhất, đáp ứng mọi nhu cầu của khách hàng.`,
    img: "https://cdn.hpdecor.vn/wp-content/uploads/2022/05/thiet-ke-shop-quan-ao-nam-1.jpeg",
    reverse: false,
  },
  {
    title: "Chất lượng và uy tín",
    text: `Chúng tôi cam kết mọi sản phẩm đều được kiểm tra kỹ lưỡng trước khi đưa ra thị trường. Khách hàng có thể yên tâm về chất lượng, chính sách đổi trả minh bạch, và dịch vụ chăm sóc khách hàng tận tâm.`,
    img: "https://xaydungthuanphuoc.com/wp-content/uploads/2022/09/1501_chinh-hang.jpg",
    reverse: true,
  },
  {
    title: "Đội ngũ chuyên nghiệp",
    text: `Đội ngũ ShopClothes luôn sẵn sàng tư vấn, hỗ trợ khách hàng. Với sự nhiệt huyết và kinh nghiệm, chúng tôi mang đến dịch vụ chu đáo, tư vấn phong cách và xu hướng thời trang phù hợp với từng cá nhân.`,
    img: "https://giakethoitrang.com/img/image/Top-5-dia-chi-mua-quan-ao-ngon-bo-re-cho-sinh-vien-Ha-Noi.jpg",
    reverse: false,
  },
];

const stats = [
  { label: "Khách hàng hài lòng", value: "10K+", icon: <Users /> },
  { label: "Sản phẩm bán ra", value: "50K+", icon: <Award /> },
  { label: "Chi nhánh", value: "05", icon: <Globe /> },
  { label: "Đối tác", value: "20+", icon: <Heart /> },
];

// --- ANIMATION CONFIG ---
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2, delayChildren: 0.3 },
  },
};

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }, // Easing mượt mà hơn (cubic-bezier)
  },
};

export default function AboutPage() {
  return (
    // Thêm antialiased để chữ mịn hơn
    <div className="pt-28 bg-white min-h-screen font-sans text-slate-900 antialiased selection:bg-gray-200 selection:text-black">
      {/* 1. HEADER SECTION */}
      <div className="px-6 md:px-12 mb-24 md:mb-36">
        <Motion.motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center max-w-3xl mx-auto"
        >
          <span className="text-gray-500 font-bold tracking-[0.25em] uppercase text-xl mb-6 block">
            Since 2025
          </span>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-slate-900 mb-8 leading-[1.1]">
            Giới thiệu{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-600">
              ShopClothes
            </span>
          </h1>
          <p className="text-slate-600 text-lg md:text-xl font-normal leading-relaxed max-w-2xl mx-auto">
            Kết hợp hoàn hảo giữa tính thời trang, chất lượng bền vững và dịch
            vụ tận tâm để tạo nên trải nghiệm mua sắm khác biệt.
          </p>
        </Motion.motion.div>
      </div>

      {/* 2. MAIN SECTIONS (ZIGZAG) */}
      <Motion.motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="flex flex-col gap-24 md:gap-40 px-6 md:px-12 max-w-screen-xl mx-auto mb-32"
      >
        {sections.map((section, idx) => (
          <Motion.motion.div
            key={idx}
            variants={fadeInUp}
            className={`flex flex-col md:flex-row items-center gap-12 md:gap-24 ${
              section.reverse ? "md:flex-row-reverse" : ""
            }`}
          >
            {/* Image Side - Bo góc ít hơn (rounded-lg) để trông hiện đại, cứng cáp hơn */}
            <div className="w-full md:w-1/2">
              <div className="relative aspect-[4/3] overflow-hidden rounded-sm bg-gray-100">
                <img
                  src={section.img}
                  alt={section.title}
                  className="w-full h-full object-cover transition-transform duration-1000 hover:scale-110"
                />
              </div>
            </div>

            {/* Text Side */}
            <div className="w-full md:w-1/2 flex flex-col justify-center">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6 tracking-tight">
                {section.title}
              </h2>
              {/* Divider nhỏ gọn */}
              <div className="w-16 h-[2px] bg-slate-900 mb-8"></div>

              {/* text-justify: Căn đều 2 bên; text-slate-600: Màu xám dịu; leading-8: Dãn dòng thoáng */}
              <p className="text-slate-600 text-lg leading-8 md:text-justify font-normal">
                {section.text}
              </p>
            </div>
          </Motion.motion.div>
        ))}
      </Motion.motion.div>

      {/* 3. STATS SECTION (Clean Minimalist) */}
      <div className="border-y border-gray-100 bg-gray-50/50 py-24 mb-24">
        <div className="max-w-screen-xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-y-12 gap-x-8 text-center">
            {stats.map((stat, idx) => (
              <Motion.motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.5 }}
                className="flex flex-col items-center"
              >
                <div className="mb-4 text-slate-800">
                  {React.cloneElement(stat.icon, {
                    strokeWidth: 1.5,
                    size: 40,
                  })}
                </div>
                <h3 className="text-4xl md:text-5xl font-bold text-slate-900 mb-2 tracking-tighter">
                  {stat.value}
                </h3>
                <p className="text-slate-500 text-sm font-medium uppercase tracking-widest">
                  {stat.label}
                </p>
              </Motion.motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. CTA SECTION (Clean Modern) */}
      <Motion.motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="pb-32 px-6"
      >
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-slate-900 tracking-tight">
            Sẵn sàng trải nghiệm?
          </h2>
          <p className="mb-10 text-lg text-slate-600 leading-relaxed">
            Khám phá bộ sưu tập mới nhất và định hình phong cách riêng của bạn
            ngay hôm nay.
          </p>
          <a
            href="/products"
            className="inline-block px-12 py-4 bg-slate-900 text-white text-sm font-semibold uppercase tracking-widest hover:bg-black transition-all duration-300 hover:-translate-y-1"
          >
            Mua sắm ngay
          </a>
        </div>
      </Motion.motion.div>
    </div>
  );
}
