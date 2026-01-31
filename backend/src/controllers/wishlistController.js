import Wishlist from "../models/wishlistModel.js";
import Product from "../models/productModel.js";

export const getWishlist = async (req, res) => {
  try {
    const userId = req.user.id;

    const wishlist = await Wishlist.findOne({ userId }).populate({
      path: "items.productId",
      select: "name price images variants averageRating numReviews categoryId",
    });

    if (!wishlist) {
      return res.json({
        userId,
        items: [],
      });
    }

    res.json(wishlist);
  } catch (error) {
    console.error("Get wishlist error:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

export const addToWishlist = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({ message: "Thiếu productId" });
    }

    // Check product tồn tại
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Sản phẩm không tồn tại" });
    }

    let wishlist = await Wishlist.findOne({ userId });

    // Chưa có wishlist → tạo mới
    if (!wishlist) {
      wishlist = await Wishlist.create({
        userId,
        items: [{ productId }],
      });

      return res.json({
        message: "Đã thêm vào wishlist",
        wishlist,
      });
    }

    // Đã có → check trùng
    const exists = wishlist.items.some(
      (item) => item.productId.toString() === productId,
    );

    if (exists) {
      return res.status(400).json({
        message: "Sản phẩm đã có trong wishlist",
      });
    }

    wishlist.items.push({ productId });
    await wishlist.save();

    res.json({
      message: "Đã thêm vào wishlist",
      wishlist,
    });
  } catch (error) {
    console.error("Add wishlist error:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

export const removeFromWishlist = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params;

    const wishlist = await Wishlist.findOneAndUpdate(
      { userId },
      { $pull: { items: { productId } } },
      { new: true },
    );

    if (!wishlist) {
      return res.status(404).json({ message: "Wishlist không tồn tại" });
    }

    res.json({
      message: "Đã xóa khỏi wishlist",
      wishlist,
    });
  } catch (error) {
    console.error("Remove wishlist error:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

export const checkWishlist = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params;

    const wishlist = await Wishlist.findOne({
      userId,
      "items.productId": productId,
    });

    res.json({
      isWishlisted: !!wishlist,
    });
  } catch (error) {
    console.error("Check wishlist error:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

export const clearWishlist = async (req, res) => {
  try {
    const userId = req.user.id;

    await Wishlist.findOneAndUpdate({ userId }, { $set: { items: [] } });

    res.json({ message: "Đã xóa toàn bộ wishlist" });
  } catch (error) {
    console.error("Clear wishlist error:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
};
