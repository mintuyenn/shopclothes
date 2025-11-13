import Cart from "../models/cartModel.js";
import Product from "../models/productModel.js";
import Discount from "../models/discountModel.js";

// =======================================
// ✅ HÀM TÍNH GIẢM GIÁ CHO SẢN PHẨM
// =======================================
const calculateProductDiscount = async (product) => {
  const now = new Date();
  const discounts = await Discount.find({
    isActive: true,
    startDate: { $lte: now },
    $or: [{ endDate: null }, { endDate: { $gte: now } }],
  });

  let bestDiscountValue = 0;

  for (const d of discounts) {
    // Nếu giảm cho toàn sàn hoặc có trong applicableProducts
    if (
      d.applicableProducts.length === 0 ||
      d.applicableProducts.includes(product._id.toString())
    ) {
      if (d.discountType === "percent") {
        bestDiscountValue = Math.max(bestDiscountValue, d.discountValue);
      } else if (d.discountType === "fixed") {
        // Tính phần trăm tương đương để so sánh
        const percentValue = (d.discountValue / product.price) * 100;
        bestDiscountValue = Math.max(bestDiscountValue, percentValue);
      }
    }
  }

  const discountAmount = (product.price * bestDiscountValue) / 100;
  const finalPrice = product.price - discountAmount;

  return { finalPrice, discountAmount, discountPercent: bestDiscountValue };
};

// =======================================
// ✅ HÀM TÍNH GIẢM GIÁ CHO GIỎ HÀNG
// =======================================
const calculateCartDiscount = async (cart) => {
  const now = new Date();
  const items = cart.items || [];

  let subtotal = items.reduce((s, i) => s + i.subtotal, 0);

  let discounts = await Discount.find({
    isActive: true,
    startDate: { $lte: now },
    $or: [{ endDate: null }, { endDate: { $gte: now } }],
  });

  let bestDiscount = null;
  let maxDiscountAmount = 0;

  // Nếu có mã giảm giá -> ép dùng đúng mã đó
  if (cart.appliedDiscountCode) {
    discounts = discounts.filter((d) => d.code === cart.appliedDiscountCode);
  }

  for (const d of discounts) {
    let discountAmount = 0;

    const applicableItems = items.filter(
      (i) =>
        d.applicableProducts.length === 0 ||
        d.applicableProducts.includes(i.productId.toString())
    );

    const applicableSubtotal = applicableItems.reduce(
      (s, i) => s + i.subtotal,
      0
    );

    switch (d.discountType) {
      case "fixed":
        discountAmount = d.discountValue;
        break;
      case "percent":
        discountAmount = applicableSubtotal * (d.discountValue / 100);
        break;
      case "quantity":
        if (items.reduce((s, i) => s + i.quantity, 0) >= d.minQuantity) {
          discountAmount = applicableSubtotal * (d.discountValue / 100);
        }
        break;
      case "holiday":
        discountAmount = d.discountValue;
        break;
    }

    if (discountAmount > maxDiscountAmount) {
      maxDiscountAmount = discountAmount;
      bestDiscount = d;
    }
  }

  const finalDiscount = Math.round(maxDiscountAmount);
  const totalPrice = Math.max(subtotal - 0, 0);

  return { subtotal, finalDiscount, totalPrice, bestDiscount };
};

// =======================================
// ✅ GET CART
// =======================================
export const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.id });

    if (!cart) {
      return res.json({
        items: [],
        subtotalPrice: 0,
        discountAmount: 0,
        appliedDiscountCode: null,
        totalPrice: 0,
      });
    }

    // cập nhật giá sản phẩm theo giảm giá mới nhất
    for (let item of cart.items) {
      const product = await Product.findById(item.productId);
      if (product) {
        const { finalPrice } = await calculateProductDiscount(product);
        item.price = product.price;
        item.salePrice = finalPrice;
        item.subtotal = item.salePrice * item.quantity;
      }
    }

    const { subtotal, finalDiscount, totalPrice } = await calculateCartDiscount(
      cart
    );

    cart.subtotalPrice = subtotal;
    cart.discountAmount = finalDiscount;
    cart.totalPrice = totalPrice;

    await cart.save();
    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
};

// =======================================
// ✅ ADD TO CART
// =======================================
export const addToCart = async (req, res) => {
  try {
    const { productId, color, size, quantity, image } = req.body;
    const product = await Product.findById(productId);
    if (!product)
      return res.status(404).json({ message: "Không tìm thấy sản phẩm" });

    let cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) cart = new Cart({ userId: req.user.id, items: [] });

    const { finalPrice } = await calculateProductDiscount(product);

    const existingItem = cart.items.find(
      (i) =>
        i.productId.toString() === productId &&
        i.color === color &&
        i.size === size
    );

    if (existingItem) {
      existingItem.quantity += quantity;
      existingItem.salePrice = finalPrice;
      existingItem.subtotal = existingItem.quantity * finalPrice;
    } else {
      cart.items.push({
        productId,
        name: product.name,
        image,
        color,
        size,
        price: product.price,
        salePrice: finalPrice,
        quantity,
        subtotal: finalPrice * quantity,
      });
    }

    const { subtotal, finalDiscount, totalPrice } = await calculateCartDiscount(
      cart
    );
    cart.subtotalPrice = subtotal;
    cart.discountAmount = finalDiscount;
    cart.totalPrice = totalPrice;

    await cart.save();
    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
};

// =======================================
// ✅ UPDATE QUANTITY
// =======================================
export const updateCart = async (req, res) => {
  try {
    const { productId, color, size, quantity } = req.body;
    const cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) return res.status(400).json({ message: "Giỏ hàng trống" });

    const item = cart.items.find(
      (i) =>
        i.productId.toString() === productId &&
        i.color === color &&
        i.size === size
    );

    if (!item)
      return res.status(404).json({ message: "Không tìm thấy sản phẩm" });

    if (quantity <= 0) {
      cart.items = cart.items.filter((i) => i !== item);
    } else {
      const product = await Product.findById(productId);
      const { finalPrice } = await calculateProductDiscount(product);
      item.quantity = quantity;
      item.salePrice = finalPrice;
      item.subtotal = item.quantity * finalPrice;
    }

    const { subtotal, finalDiscount, totalPrice } = await calculateCartDiscount(
      cart
    );
    cart.subtotalPrice = subtotal;
    cart.discountAmount = finalDiscount;
    cart.totalPrice = totalPrice;

    await cart.save();
    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
};

// =======================================
// ✅ REMOVE ITEM
// =======================================
export const removeFromCart = async (req, res) => {
  try {
    const { productId, color, size } = req.body;
    const cart = await Cart.findOne({ userId: req.user.id });
    if (!cart)
      return res.status(404).json({ message: "Không tìm thấy giỏ hàng" });

    cart.items = cart.items.filter(
      (i) =>
        !(
          i.productId.toString() === productId &&
          i.color === color &&
          i.size === size
        )
    );

    const { subtotal, finalDiscount, totalPrice } = await calculateCartDiscount(
      cart
    );
    cart.subtotalPrice = subtotal;
    cart.discountAmount = finalDiscount;
    cart.totalPrice = totalPrice;

    await cart.save();
    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
};

// =======================================
// ✅ ÁP DỤNG MÃ GIẢM GIÁ
// =======================================
export const applyDiscountCode = async (req, res) => {
  try {
    const { code } = req.body;
    const cart = await Cart.findOne({ userId: req.user.id });
    const discount = await Discount.findOne({ code });

    if (!discount)
      return res.status(400).json({ message: "Mã giảm giá không hợp lệ" });

    cart.appliedDiscountCode = code;

    const { subtotal, finalDiscount, totalPrice } = await calculateCartDiscount(
      cart
    );
    cart.subtotalPrice = subtotal;
    cart.discountAmount = finalDiscount;
    cart.totalPrice = totalPrice;

    await cart.save();
    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
};

// =======================================
// ✅ CLEAR CART
// =======================================
export const clearCart = async (req, res) => {
  await Cart.findOneAndUpdate(
    { userId: req.user.id },
    {
      items: [],
      subtotalPrice: 0,
      discountAmount: 0,
      appliedDiscountCode: null,
      totalPrice: 0,
    }
  );
  res.json({ message: "Đã xoá giỏ hàng" });
};
