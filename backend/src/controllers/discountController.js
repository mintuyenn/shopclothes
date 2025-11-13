import Discount from "../models/discountModel.js";
import User from "../models/userModel.js";

/** 🟢 Tạo giảm giá mới (Admin) */
export const createDiscount = async (req, res) => {
  try {
    const discount = await Discount.create(req.body);
    res
      .status(201)
      .json({ success: true, message: "Tạo giảm giá thành công!", discount });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/** 🟡 Lấy tất cả giảm giá */
export const getAllDiscounts = async (req, res) => {
  try {
    const discounts = await Discount.find().populate("applicableProducts");
    res.json({ success: true, data: discounts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/** 🔵 Lấy chi tiết giảm giá theo ID */
export const getDiscountById = async (req, res) => {
  try {
    const discount = await Discount.findById(req.params.id).populate(
      "applicableProducts"
    );
    if (!discount)
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy giảm giá" });
    res.json({ success: true, data: discount });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/** 🟠 Cập nhật giảm giá */
export const updateDiscount = async (req, res) => {
  try {
    const discount = await Discount.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!discount)
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy giảm giá" });
    res.json({ success: true, message: "Cập nhật thành công", discount });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/** 🔴 Xóa giảm giá */
export const deleteDiscount = async (req, res) => {
  try {
    const discount = await Discount.findByIdAndDelete(req.params.id);
    if (!discount)
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy giảm giá" });
    res.json({ success: true, message: "Đã xóa giảm giá" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/** 🟢 Lấy tất cả giảm giá còn hiệu lực */
export const getActiveDiscounts = async (req, res) => {
  try {
    const discounts = await Discount.find({
      isActive: true,
      $or: [{ endDate: { $exists: false } }, { endDate: { $gte: new Date() } }],
    }).populate("applicableProducts");

    res.json({ success: true, data: discounts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/** 🔹 Áp dụng giảm giá cho Home / Product List (percent & holiday) */
export const applyDiscountsForHome = (products, discounts) => {
  const validDiscounts = discounts.filter(
    (d) =>
      d.isActive &&
      (!d.startDate || new Date() >= d.startDate) &&
      (!d.endDate || new Date() <= d.endDate) &&
      ["percent", "holiday"].includes(d.discountType)
  );

  return products.map((product) => {
    let discountedPrice = product.price;
    let appliedDiscount = null;

    validDiscounts.forEach((discount) => {
      // Kiểm tra nếu discount áp dụng cho sản phẩm cụ thể
      if (
        discount.applicableProducts.length > 0 &&
        !discount.applicableProducts.some(
          (id) => id.toString() === product._id.toString()
        )
      )
        return;

      let tempPrice = product.price;

      if (discount.discountType === "percent") {
        tempPrice = Math.max(
          0,
          product.price - (product.price * discount.discountValue) / 100
        );
      } else if (discount.discountType === "holiday") {
        tempPrice = Math.max(0, product.price - discount.discountValue);
      }

      if (tempPrice < discountedPrice) {
        discountedPrice = tempPrice;
        appliedDiscount = discount;
      }
    });

    return {
      ...product,
      finalPrice: Math.round(discountedPrice),
      discountInfo: appliedDiscount
        ? {
            name: appliedDiscount.name,
            value: appliedDiscount.discountValue,
            type: appliedDiscount.discountType,
          }
        : null,
    };
  });
};

/** 🔹 Handler cho route /apply-home */
export const applyDiscountsHomeHandler = (req, res) => {
  try {
    const { products, discounts } = req.body;

    if (!products || !Array.isArray(products) || products.length === 0)
      return res
        .status(400)
        .json({ success: false, message: "Thiếu products hoặc products rỗng" });

    if (!discounts || !Array.isArray(discounts))
      return res
        .status(400)
        .json({ success: false, message: "Thiếu discounts hoặc không hợp lệ" });

    const updatedProducts = applyDiscountsForHome(products, discounts);
    res.json({ success: true, data: updatedProducts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/** 🔹 Áp dụng giảm giá cho Checkout (all loại, chọn cao nhất) */
export const applyDiscountsForCheckout = async (req, res) => {
  try {
    const { products, totalAmount, quantity } = req.body;

    if (!products || totalAmount === undefined || quantity === undefined) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Thiếu dữ liệu: products, totalAmount hoặc quantity",
        });
    }

    const now = new Date();

    const discounts = await Discount.find({
      isActive: true,
      startDate: { $lte: now },
      $or: [{ endDate: { $exists: false } }, { endDate: { $gte: now } }],
    });

    let bestDiscount = null;
    let maxDiscountAmount = 0;

    for (const d of discounts) {
      let discountAmount = 0;

      switch (d.discountType) {
        case "fixed":
          discountAmount = d.discountValue;
          break;
        case "quantity":
          if (quantity >= d.minQuantity)
            discountAmount = (totalAmount * d.discountValue) / 100;
          break;
        case "percent":
          discountAmount = (totalAmount * d.discountValue) / 100;
          break;
        case "holiday":
          discountAmount = d.discountValue;
          break;
      }

      // Kiểm tra nếu discount áp dụng cho sản phẩm cụ thể
      if (
        d.applicableProducts.length > 0 &&
        !products.some((p) =>
          d.applicableProducts.some((id) => id.toString() === p._id.toString())
        )
      ) {
        discountAmount = 0; // không áp dụng
      }

      if (!bestDiscount || discountAmount > maxDiscountAmount) {
        bestDiscount = d;
        maxDiscountAmount = discountAmount;
      }
    }

    const finalPrice = Math.max(totalAmount - maxDiscountAmount, 0);

    if (bestDiscount) {
      res.json({
        success: true,
        message: `Áp dụng giảm giá: ${bestDiscount.name}`,
        discountApplied: bestDiscount,
        discountAmount: maxDiscountAmount,
        finalPrice,
      });
    } else {
      res.json({
        success: false,
        message: "Không có giảm giá phù hợp",
        discountAmount: 0,
        finalPrice: totalAmount,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};
