import express from "express";
import {
  createReview,
  getProductReviews,
} from "../controllers/reviewController.js";
import { protect, onlyCustomer } from "../middleware/authMiddleware.js"; // nếu dùng auth

const router = express.Router();

router.post("/", protect, onlyCustomer, createReview);
router.get("/:productId", getProductReviews);
export default router;
