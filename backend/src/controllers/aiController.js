import asyncHandler from "express-async-handler";
import Product from "../models/productModel.js";
import Category from "../models/categogyModel.js";
import Order from "../models/orderModel.js";

// =======================================================
//  SEARCH PRODUCT - BẢN FULL TỐI ƯU
// =======================================================
const aiSearchProducts = asyncHandler(async (req, res) => {
  let { keyword } = req.body;

  if (!keyword || typeof keyword !== "string") {
    return res.json({
      found: false,
      message: "Vui lòng nhập từ khóa sản phẩm.",
    });
  }

  // 1) Chuẩn hóa keyword
  const clean = keyword
    .toLowerCase()
    .normalize("NFD") // xoá dấu tiếng Việt
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9 ]/g, " ") // loại ký tự đặc biệt
    .trim();

  // 2) Stopwords (ĐÃ FIX KHÔNG XOÁ: ví, vớ, dây, nịt, mũ...)
  const stopwords = [
    "tim",
    "giup",
    "xem",
    "coi",
    "cho",
    "toi",
    "muon",
    "xin",
    "san",
    "pham",
    "sp",
    "con",
    "khong",
    "ko",
    "cai",
    "nay",
    "do",
    "cua",
    "la",
    "het",
    "hang",
  ];

  let words = clean
    .split(/\s+/)
    .filter((w) => w.length > 1 && !stopwords.includes(w));

  if (words.length === 0) {
    return res.json({
      found: false,
      message: "Không xác định được từ khóa tìm kiếm.",
    });
  }

  const fullKeyword = words.join(" ");

  // =======================================================
  // 3) Tải category name để search theo danh mục
  // =======================================================
  const categories = await Category.find();
  const categoryMap = {};
  categories.forEach((c) => (categoryMap[c._id] = c.name.toLowerCase()));

  // =======================================================
  // 4) Tải toàn bộ sản phẩm (dễ xử lý tìm kiếm nâng cao)
  // =======================================================
  const allProducts = await Product.find({}).lean();

  // =======================================================
  // 5) Lọc sản phẩm theo từ khóa
  // => MATCH theo nhiều tiêu chí
  // =======================================================
  const matched = allProducts.filter((p) => {
    const name =
      p.name
        ?.toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "") || "";
    const desc = p.description?.toLowerCase() || "";
    const categoryName = categoryMap[p.categoryId]?.toLowerCase() || "";

    // Ghép toàn bộ variant màu + size
    const variantColors = (p.variants || [])
      .map((v) => v.color?.toLowerCase() || "")
      .join(" ");

    // Điều kiện match
    return (
      name.includes(fullKeyword) || // tên sản phẩm
      words.some((w) => name.includes(w)) || // 1 từ khớp tên
      desc.includes(fullKeyword) || // mô tả
      variantColors.includes(fullKeyword) || // màu sắc
      words.some((w) => variantColors.includes(w)) || // 1 từ trùng màu
      categoryName.includes(fullKeyword) || // tên danh mục
      words.some((w) => categoryName.includes(w)) // 1 từ trùng danh mục
    );
  });

  if (matched.length === 0) {
    return res.json({
      found: false,
      message: "Không tìm thấy sản phẩm phù hợp.",
    });
  }

  // =======================================================
  // 6) Format sản phẩm trả về
  // =======================================================
  const result = matched.map((p) => {
    let totalStock = 0;
    let colors = [];
    let stockDetails = [];

    if (Array.isArray(p.variants)) {
      p.variants.forEach((v) => {
        if (v.color) colors.push(v.color);

        if (Array.isArray(v.sizes)) {
          v.sizes.forEach((s) => {
            totalStock += s.stock || 0;

            stockDetails.push({
              color: v.color,
              size: s.size,
              stock: s.stock,
              status: s.stock > 0 ? "Còn hàng" : "Hết hàng",
              image: v.images?.[0] || "", // hình theo biến thể
            });
          });
        }
      });
    }

    // Ưu tiên hình variant, fallback hình product
    const imageFallback =
      stockDetails.find((x) => x.image)?.image || p.images?.[0] || "";

    return {
      name: p.name,
      price: p.price ? p.price.toLocaleString("vi-VN") + " đ" : "Liên hệ",
      status: totalStock > 0 ? `Còn hàng (Tổng: ${totalStock})` : "Hết hàng",
      colors: [...new Set(colors)].join(", "),
      description: p.description || "",
      image: imageFallback,
      stockDetails,
    };
  });

  res.json({ found: true, data: result });
});

// =====================================================================
// TOOL 2: Lấy danh mục sản phẩm
// Logic: Lấy tên các danh mục để AI biết shop bán gì
// =====================================================================
const aiGetCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find({}).select("name");

  const names = categories.map((c) => c.name);

  res.json({
    message: "Danh sách danh mục hiện có",
    data: names,
  });
});

// =====================================================================
// TOOL 3: Tra cứu đơn hàng
// Logic: Tìm theo orderCode (VD: ORD1764218080714) vì khách sẽ nhớ mã này
// =====================================================================
const aiCheckOrder = asyncHandler(async (req, res) => {
  let { orderCode } = req.body;

  if (!orderCode) {
    return res.json({
      found: false,
      message: "Vui lòng nhập mã đơn hàng (Ví dụ: ORD...).",
    });
  }

  // 🔥 TỰ ĐỘNG TÁCH MÃ ĐƠN HÀNG TRONG CÂU
  const match = orderCode.match(/ORD\d+/i);

  if (!match) {
    return res.json({
      found: false,
      message: "Không tìm thấy mã đơn hàng hợp lệ (phải dạng ORDxxxx).",
    });
  }

  orderCode = match[0];

  // 🔍 Tìm đơn hàng
  const order = await Order.findOne({ orderCode });

  if (!order) {
    return res.json({
      found: false,
      message: `Không tìm thấy đơn hàng có mã ${orderCode}.`,
    });
  }

  const orderDate = new Date(order.createdAt).toLocaleDateString("vi-VN");

  res.json({
    found: true,
    orderCode: order.orderCode,
    status: order.orderStatus,
    paymentStatus: order.paymentStatus,
    paymentMethod: order.paymentMethod,
    totalPrice: order.totalPrice.toLocaleString("vi-VN") + " đ",
    orderDate,
  });
});

export { aiSearchProducts, aiGetCategories, aiCheckOrder };
