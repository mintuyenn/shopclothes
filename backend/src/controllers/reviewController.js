import Review from "../models/reviewModel.js";
import Product from "../models/productModel.js";
import Order from "../models/orderModel.js";

export const createReview = async (req, res) => {
  try {
    const { productId, orderId, rating, comment, color, size } = req.body;
    const userId = req.user._id;

    if (!productId || !rating || !orderId) {
      return res.status(400).json({
        message: "Thiếu productId, orderId hoặc rating",
      });
    }

    // 1. Kiểm tra đơn hàng hợp lệ & đã hoàn thành
    const order = await Order.findOne({
      _id: orderId,
      userId,
      orderStatus: "Đã hoàn thành",
    });

    if (!order) {
      return res.status(400).json({
        message: "Bạn chỉ có thể đánh giá sản phẩm từ đơn hàng đã hoàn thành",
      });
    }

    // 2. Kiểm tra sản phẩm có trong đơn hàng không
    const hasProduct = order.items.find(
      (item) => item.productId.toString() === productId,
    );

    if (!hasProduct) {
      return res.status(400).json({
        message: "Sản phẩm không tồn tại trong đơn hàng này",
      });
    }

    // 3. Kiểm tra đã review sản phẩm này chưa (theo user + product + order)
    const existingReview = await Review.findOne({
      userId,
      productId,
      orderId,
    });

    if (existingReview) {
      return res.status(400).json({
        message: "Bạn đã đánh giá sản phẩm này rồi",
      });
    }

    // 4. Tạo review
    const review = await Review.create({
      userId,
      productId,
      orderId,
      rating,
      comment,
      color,
      size,
    });

    // 5. Cập nhật điểm trung bình & số lượng review cho Product
    const reviews = await Review.find({ productId });
    const numReviews = reviews.length;
    const averageRating =
      reviews.reduce((sum, r) => sum + r.rating, 0) / numReviews;

    await Product.findByIdAndUpdate(productId, {
      numReviews,
      averageRating,
    });

    res.status(201).json({
      success: true,
      message: "Đánh giá của bạn đã được ghi nhận!",
      data: review,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        message: "Bạn đã đánh giá sản phẩm này rồi",
      });
    }

    res.status(500).json({
      message: "Lỗi hệ thống",
      error: error.message,
    });
  }
};

export const getProductReviews = async (req, res) => {
  try {
    const reviews = await Review.find({
      productId: req.params.productId,
    })
      .populate("userId", "username avatar")
      .sort("-createdAt");

    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: "Lỗi lấy đánh giá" });
  }
};
