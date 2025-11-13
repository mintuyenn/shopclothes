import express from "express";
import {
  getCart,
  addToCart,
  updateCart,
  removeFromCart,
  clearCart,
  applyDiscountCode,
} from "../controllers/cartController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// User phải login mới dùng cart
router.get("/", protect, getCart);
router.post("/add", protect, addToCart);
router.put("/update", protect, updateCart);
router.delete("/remove", protect, removeFromCart);
router.delete("/clear", protect, clearCart);
router.post("/apply-discount", protect, applyDiscountCode);

export default router;
