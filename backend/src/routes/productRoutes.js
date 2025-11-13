import express from "express";
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getLatestProducts,
  getProductsByCategoryTree,
  searchProducts,
  getRelatedProducts,
} from "../controllers/productController.js";

const router = express.Router();

// GET all products (hỗ trợ lọc, phân trang, sort)
router.get("/", getProducts);

router.get("/latest", getLatestProducts);

router.get("/by-category/:id", getProductsByCategoryTree);

router.get("/search", searchProducts);

router.get("/related/:id", getRelatedProducts);

// GET product by ID
router.get("/:id", getProductById);

// POST create product
router.post("/", createProduct);

// PUT update product
router.put("/:id", updateProduct);

// DELETE product
router.delete("/:id", deleteProduct);

export default router;
