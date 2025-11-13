// Footer.jsx
import React from "react";
import bocongthuong from "../assets/bocongthuong.png";
import pttt from "../assets/pttt.jpg";

const supportLinks = [
  { name: "Hướng dẫn mua hàng", href: "/user-guide-pro" },
  { name: "Chính sách đổi trả & bảo hành", href: "/warrant-policy" },
  { name: "Hệ thống cửa hàng", href: "/store-system" },
  { name: "Quy trình giao nhận và thanh toán", href: "/user-guide-pro" },
  { name: "Chính sách thành viên", href: "/member-policy" },
];

const policyLinks = [
  { name: "Tìm kiếm", href: "/" },
  { name: "Giới thiệu", href: "/about" },
  { name: "Sản phẩm của cửa hàng", href: "/products" },
];

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-10">
      {/* Container chính */}
      <div className="max-w-7xl mx-auto py-12 px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Cột 1: Về chúng tôi */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">
              Về chúng tôi
            </h3>
            <div className="text-2xl font-extrabold text-white mb-4">
              <span className="tracking-widest">SHOPCLOTHES</span>
            </div>
            <p className="text-sm leading-relaxed text-gray-400">
              Thương hiệu thời trang SHOPCLOTHES phát triển mạnh với dòng áo
              khoác và áo phông hình in, đặc biệt chú trọng đến{" "}
              <span className="font-semibold text-white">chất lượng</span> và{" "}
              <span className="font-semibold text-white">
                quy trình sản xuất an toàn
              </span>
              .
            </p>
          </div>

          {/* Cột 2: Chính sách */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">
              Chính sách
            </h3>
            <ul className="space-y-2 text-sm">
              {policyLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="hover:text-white transition-colors duration-200"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Cột 3: Hỗ trợ khách hàng */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">
              Hỗ trợ khách hàng
            </h3>
            <ul className="space-y-2 text-sm">
              {supportLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="hover:text-white transition-colors duration-200"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Cột 4: Thanh toán + Bộ Công Thương */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">
              Phương thức thanh toán
            </h3>
            <div className="flex space-x-3 mb-6">
              <img
                src={pttt}
                alt="MoMo"
                className="h-10 w-auto rounded-md shadow-md"
              />
            </div>
            <div>
              <img
                src={bocongthuong}
                alt="Đã thông báo Bộ Công Thương"
                className="h-16 w-auto"
              />
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-700 mt-10 pt-6 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} SHOPCLOTHES | Cung cấp bởi Haravan
        </div>
      </div>
    </footer>
  );
};

export default Footer;
