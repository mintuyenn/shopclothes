import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  name: String,
  image: String,
  price: Number,
  quantity: Number,
  color: String,
  size: String,
  subtotal: Number,
});

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    orderCode: { type: String, unique: true },
    items: [orderItemSchema],
    subtotalPrice: { type: Number, required: true },
    appliedDiscountCode: { type: String, default: null },
    discountAmount: { type: Number, required: true, default: 0 },
    totalPrice: { type: Number, required: true },
    paymentStatus: {
      type: String,
      enum: ["Chưa thanh toán", "Thành công", "Thất bại"],
      default: "Chưa thanh toán",
    },
    orderStatus: {
      type: String,
      enum: [
        "Chờ xác nhận",
        "Đã xác nhận",
        "Đang giao",
        "Đã hoàn thành",
        "Đã hủy",
      ],
      default: "Chờ xác nhận",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
