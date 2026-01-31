import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    // Lưu lại thông tin phân loại lúc mua
    color: String,
    size: String,
    rating: { type: Number, min: 1, max: 5, required: true },
    comment: { type: String },
  },
  { timestamps: true },
);

// Tránh việc 1 user đánh giá 1 sản phẩm nhiều lần trong cùng 1 đơn hàng
reviewSchema.index({ userId: 1, productId: 1, orderId: 1 }, { unique: true });

export default mongoose.model("Review", reviewSchema);
