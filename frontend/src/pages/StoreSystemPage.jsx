import React from "react";
import { MapPin, Clock, Users, ExternalLink } from "lucide-react";
import * as Motion from "framer-motion";

export default function StoreSystemPage() {
  const stores = [
    {
      id: 1,
      name: "Cửa hàng ShopClothes - Quận Phú Nhuận",
      address: "112 Hồ Văn Huê, Phường 9, Quận Phú Nhuận, TP.HCM",
      hours: "09:00 - 21:00",
      image: "src/assets/store1.jpeg",
    },
    {
      id: 2,
      name: "Cửa hàng ShopClothes - Quận Tân Bình",
      address: "56 Cộng Hòa, Phường 4, Quận Tân Bình, TP.HCM",
      hours: "09:00 - 21:00",
      image: "src/assets/store2.jpg",
    },
  ];

  const openGoogleMaps = (address) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      address
    )}`;
    window.open(url, "_blank");
  };

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
      <div className="text-center mb-12">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-pink-700 mb-4 animate-pulse">
          Hệ thống cửa hàng ShopClothes
        </h1>
        <p className="text-gray-700 text-lg sm:text-xl max-w-2xl mx-auto">
          Hãy đến ngay hệ thống cửa hàng ShopClothes tại Thành Phố Hồ Chí Minh
          để tận hưởng trải nghiệm mua sắm chân thật: cảm nhận chất liệu vải
          công nghệ cao, thỏa thích thử đồ và khám phá gu thời trang của bạn qua
          sự tư vấn các bạn nhân viên{" "}
          <span className="font-semibold">"stylist"</span> dễ mến.
        </p>
      </div>

      {/* Stores Grid */}
      <Motion.motion.div
        className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        {stores.map((store) => (
          <Motion.motion.div
            key={store.id}
            variants={cardVariants}
            className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition duration-500 flex flex-col"
          >
            {/* Image */}
            <div className="h-64 w-full overflow-hidden relative">
              <img
                src={store.image}
                alt={store.name}
                className="w-full h-full object-cover transform hover:scale-105 transition duration-500"
              />
            </div>

            {/* Content */}
            <div className="p-6 flex flex-col gap-3 flex-1">
              <h2 className="text-2xl font-bold text-gray-900">{store.name}</h2>
              <p className="flex items-center gap-2 text-gray-700">
                <MapPin className="h-5 w-5 text-red-500" /> {store.address}
              </p>
              <p className="flex items-center gap-2 text-gray-700">
                <Clock className="h-5 w-5 text-blue-500" /> Giờ hoạt động:{" "}
                {store.hours}
              </p>

              <div className="mt-4 flex flex-col sm:flex-row gap-2">
                <Motion.motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => openGoogleMaps(store.address)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg font-medium transition"
                >
                  <ExternalLink className="h-4 w-4" /> Xem trên Google Maps
                </Motion.motion.button>
              </div>
            </div>
          </Motion.motion.div>
        ))}
      </Motion.motion.div>

      {/* Call to Action */}
      <Motion.motion.div
        className="mt-12 text-center bg-gradient-to-r from-red-500 to-pink-600 text-white py-12 rounded-2xl shadow-lg"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
      >
        <Users className="mx-auto mb-4 h-10 w-10" />
        <h3 className="text-3xl font-bold mb-3">
          Trải nghiệm mua sắm chân thật cùng ShopClothes
        </h3>
        <p className="max-w-2xl mx-auto text-lg">
          Hãy ghé thăm cửa hàng để thử đồ, cảm nhận chất liệu vải công nghệ cao,
          và nhận tư vấn phong cách cá nhân từ các stylist thân thiện của chúng
          tôi.
        </p>
      </Motion.motion.div>
    </div>
  );
}
