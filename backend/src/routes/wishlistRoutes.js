import express from "express";
import {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  checkWishlist,
  clearWishlist,
} from "../controllers/wishlistController.js";
import { protect, onlyCustomer } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect, onlyCustomer);

router.get("/", getWishlist);
router.post("/", addToWishlist);
router.get("/check/:productId", checkWishlist);
router.delete("/:productId", removeFromWishlist);
router.delete("/", clearWishlist);

export default router;
