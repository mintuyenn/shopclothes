import mongoose from "mongoose";
import dotenv from "dotenv";
import Discount from "./models/discountModel.js";
import { connectDB } from "./config/db.js";

dotenv.config(); // Đọc biến môi trường từ .env

// Kết nối database
connectDB();

// 🧾 Dữ liệu mẫu giảm giá
const sampleDiscounts = [
  {
    name: "Giảm 10% cho người mới",
    discountType: "new_user",
    discountValue: 10,
    description: "Ưu đãi dành riêng cho người dùng mới trong 3 ngày đầu.",
    startDate: new Date(),
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 ngày
    isActive: true,
  },
  {
    name: "Giảm 20% Black Friday",
    code: "BLACKFRIDAY20", // 🎁 Mã voucher
    discountType: "holiday",
    discountValue: 20,
    description: "Giảm 20% toàn bộ sản phẩm nhân dịp Black Friday.",
    startDate: new Date("2025-11-25"),
    endDate: new Date("2025-11-30"),
    isActive: true,
  },
  {
    name: "Mua nhiều giảm nhiều",
    discountType: "quantity",
    discountValue: 15,
    minQuantity: 3,
    description: "Giảm 15% cho đơn hàng từ 3 sản phẩm trở lên.",
    isActive: true,
  },
  {
    name: "Giảm 100k đơn trên 1 triệu",
    discountType: "fixed",
    discountValue: 100000,
    description: "Giảm ngay 100.000đ cho đơn hàng từ 1.000.000đ.",
    startDate: new Date(),
    endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 ngày
    isActive: true,
  },
  {
    name: "Giảm 5% sản phẩm hot",
    discountType: "percent",
    discountValue: 5,
    description: "Áp dụng cho một số sản phẩm hot trong tuần này.",
    applicableProducts: [],
    startDate: new Date(),
    endDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
    isActive: true,
  },
  {
    name: "Giảm giá toàn bộ sản phẩm 5%",
    discountType: "percent",
    discountValue: 5,
    description: "Giảm ngay 5% cho tất cả sản phẩm trong cửa hàng.",
    startDate: new Date(),
    endDate: new Date("2025-11-14T23:59:59Z"),
    isActive: true,
  },
];

// 🚀 Hàm seed dữ liệu
const seedDiscounts = async () => {
  try {
    await Discount.deleteMany(); // Xóa dữ liệu cũ
    const created = await Discount.insertMany(sampleDiscounts);
    console.log(`✅ Đã chèn ${created.length} giảm giá mẫu`);
    process.exit();
  } catch (error) {
    console.error("❌ Lỗi khi seed:", error);
    process.exit(1);
  }
};

seedDiscounts();
