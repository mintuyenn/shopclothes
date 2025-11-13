import express from "express";
import {
  createDiscount,
  getAllDiscounts,
  getDiscountById,
  updateDiscount,
  deleteDiscount,
  applyDiscountsHomeHandler,
  applyDiscountsForCheckout,
  getActiveDiscounts,
} from "../controllers/discountController.js";

const router = express.Router();

// 🟢 Tạo giảm giá mới (Admin)
router.post("/", createDiscount);

router.get("/active", getActiveDiscounts);

// 🟡 Lấy tất cả giảm giá
router.get("/", getAllDiscounts);

// 🔵 Lấy chi tiết giảm giá theo ID
router.get("/:id", getDiscountById);

// 🟠 Cập nhật giảm giá
router.put("/:id", updateDiscount);

// 🔴 Xóa giảm giá
router.delete("/:id", deleteDiscount);

/** ===============================
 * 🎁 ÁP DỤNG GIẢM GIÁ
 * =============================== */
// Trang Home
router.post("/apply-home", applyDiscountsHomeHandler);
// Checkout / giỏ hàng
router.post("/apply-checkout", applyDiscountsForCheckout);

export default router;
