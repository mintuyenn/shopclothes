import mongoose from "mongoose";
import dotenv from "dotenv";
import Category from "./models/categogyModel.js";
import Product from "./models/productModel.js";
import { connectDB } from "./config/db.js";

dotenv.config();
async function seed() {
  try {
    await connectDB();

    await Category.deleteMany({});
    await Product.deleteMany({});

    // 1. Thêm categories
    const categories = await Category.insertMany([
      { name: "Áo", parentId: null },
      { name: "Quần", parentId: null },
      { name: "Phụ kiện", parentId: null },

      // Sub categories for Áo
      { name: "Áo thun", parentId: null }, // sẽ update sau
      { name: "Áo polo", parentId: null },
      { name: "Áo sơ mi", parentId: null },
      { name: "Áo khoác", parentId: null },

      { name: "Áo thun tay ngắn", parentId: null },
      { name: "Áo thun tay dài", parentId: null },
      { name: "Áo sơ mi dài tay", parentId: null },

      { name: "Áo sơ mi ngắn tay", parentId: null },
      { name: "Áo khoác jean", parentId: null },
      { name: "Áo khoác sơ mi", parentId: null },

      // Sub categories for Quần
      { name: "Quần jean", parentId: null },
      { name: "Quần short", parentId: null },
      { name: "Quần dài", parentId: null },

      { name: "Quần dài jogger", parentId: null },
      { name: "Quần dài tây", parentId: null },
      { name: "Quần dài kaki", parentId: null },

      { name: "Quần short kaki", parentId: null },
      { name: "Quần short thun", parentId: null },

      { name: "Quần jean slim-fit", parentId: null },
      { name: "Quần jean loose-fit", parentId: null },

      // Sub categories for Phụ kiện
      { name: "Mũ", parentId: null },
      { name: "Ví", parentId: null },
      { name: "Vớ", parentId: null },
      { name: "Dây nịt", parentId: null },
    ]);

    // Sau khi insert
    const catMap = Object.fromEntries(categories.map((c) => [c.name, c._id]));

    // Gán parent cho level 1
    await Category.updateMany(
      { name: { $in: ["Áo thun", "Áo polo", "Áo sơ mi", "Áo khoác"] } },
      { parentId: catMap["Áo"] }
    );
    await Category.updateMany(
      { name: { $in: ["Quần jean", "Quần short", "Quần dài"] } },
      { parentId: catMap["Quần"] }
    );
    await Category.updateMany(
      { name: { $in: ["Mũ", "Ví", "Vớ", "Dây nịt"] } },
      { parentId: catMap["Phụ kiện"] }
    );

    // Gán parent cho level 2 (sub của sub)
    await Category.updateMany(
      { name: { $in: ["Áo thun tay ngắn", "Áo thun tay dài"] } },
      { parentId: catMap["Áo thun"] }
    );
    await Category.updateMany(
      { name: { $in: ["Áo sơ mi dài tay", "Áo sơ mi ngắn tay"] } },
      { parentId: catMap["Áo sơ mi"] }
    );
    await Category.updateMany(
      { name: { $in: ["Áo khoác jean", "Áo khoác sơ mi"] } },
      { parentId: catMap["Áo khoác"] }
    );

    await Category.updateMany(
      { name: { $in: ["Quần dài jogger", "Quần dài tây", "Quần dài kaki"] } },
      { parentId: catMap["Quần dài"] }
    );
    await Category.updateMany(
      {
        name: { $in: ["Quần short kaki", "Quần short thun"] },
      },
      { parentId: catMap["Quần short"] }
    );
    await Category.updateMany(
      { name: { $in: ["Quần jean slim-fit", "Quần jean loose-fit"] } },
      { parentId: catMap["Quần jean"] }
    );

    console.log("✅ Thêm categories thành công");

    // 2. Thêm products
    const products = [
      {
        name: "Áo Khoác Jean Nhuộm Hoạt Tính Bền Màu Multi-Color Jean",
        categoryId: catMap["Áo khoác jean"],
        price: 199000,
        description: "Áo khoác jean bền màu, phong cách unisex",
        images: [
          "https://res.cloudinary.com/dhbz4atrb/image/upload/v1759225066/myclothes/xovpwrgweq2t3i5fqau0.webp",
          "https://res.cloudinary.com/dhbz4atrb/image/upload/v1759225067/myclothes/pg9wp2x9g6vzt0wxkq6z.webp",
          "https://res.cloudinary.com/dhbz4atrb/image/upload/v1759225070/myclothes/jalzdb8pg8pwrg3yt6rv.webp",
          "https://res.cloudinary.com/dhbz4atrb/image/upload/v1759225071/myclothes/mx0sfdzosxitzurmeowp.webp",
          "https://res.cloudinary.com/dhbz4atrb/image/upload/v1759225069/myclothes/pjmf4zef9k5efir2xuia.webp",
        ],
        variants: [
          {
            color: "Vàng nhạt",
            sizes: [
              { size: "S", stock: 10 },
              { size: "M", stock: 15 },
              { size: "L", stock: 8 },
            ],
          },
          {
            color: "Đen",
            sizes: [
              { size: "S", stock: 12 },
              { size: "M", stock: 10 },
              { size: "L", stock: 9 },
            ],
          },
          {
            color: "Nâu",
            sizes: [
              { size: "S", stock: 12 },
              { size: "M", stock: 15 },
              { size: "L", stock: 9 },
            ],
          },
          {
            color: "Xám đen",
            sizes: [
              { size: "S", stock: 20 },
              { size: "M", stock: 18 },
              { size: "L", stock: 9 },
            ],
          },
          {
            color: "Đỏ nhạt",
            sizes: [
              { size: "S", stock: 11 },
              { size: "M", stock: 15 },
              { size: "L", stock: 9 },
            ],
          },
        ],
      },
      {
        name: "Áo Khoác Jean Phối Nón The Original",
        categoryId: catMap["Áo khoác jean"],
        price: 149000,
        description: "Áo khoác jean phối nón, phong cách trẻ trung",
        images: [
          "https://res.cloudinary.com/dhbz4atrb/image/upload/v1759225065/myclothes/x6ghcdghu4qlq8clnaqi.webp",
          "https://res.cloudinary.com/dhbz4atrb/image/upload/v1759225064/myclothes/kifncxpepv4jbvcusgyd.webp",
          "https://res.cloudinary.com/dhbz4atrb/image/upload/v1759225062/myclothes/u9wag2gcgnyyebixunyc.webp",
        ],
        variants: [
          {
            color: "Xanh nhạt",
            sizes: [
              { size: "M", stock: 20 },
              { size: "L", stock: 15 },
              { size: "XL", stock: 10 },
            ],
          },
          {
            color: "Xanh dương",
            sizes: [
              { size: "M", stock: 18 },
              { size: "L", stock: 12 },
              { size: "XL", stock: 8 },
            ],
          },
          {
            color: "Xanh đậm",
            sizes: [
              { size: "M", stock: 15 },
              { size: "L", stock: 10 },
              { size: "XL", stock: 5 },
            ],
          },
        ],
      },
      {
        name: "Áo Sơ Mi Caro Tay Dài Mềm Mịn No Style",
        categoryId: catMap["Áo khoác sơ mi"],
        price: 299000,
        description: "Áo sơ mi caro tay dài, chất liệu mềm mịn",
        images: [
          "https://res.cloudinary.com/dhbz4atrb/image/upload/v1759229196/myclothes/hl2shhjyrz0wvxkrrbn3.jpg",
          "https://res.cloudinary.com/dhbz4atrb/image/upload/v1759229197/myclothes/fymlegvbmc4lurfbxasj.webp",
        ],
        variants: [
          {
            color: "Nâu",
            sizes: [
              { size: "M", stock: 20 },
              { size: "L", stock: 15 },
              { size: "XL", stock: 10 },
            ],
          },
          {
            color: "Xanh đen",
            sizes: [
              { size: "M", stock: 18 },
              { size: "L", stock: 12 },
              { size: "XL", stock: 8 },
            ],
          },
        ],
      },
      {
        name: "Áo Sơ Mi Tay Dài Vải Corduroy Ít Nhăn",
        categoryId: catMap["Áo khoác sơ mi"],
        price: 499000,
        description: "Áo sơ mi tay dài, chất liệu vải corduroy ít nhăn",
        images: [
          "https://res.cloudinary.com/dhbz4atrb/image/upload/v1759229198/myclothes/c5esumxdfn0njd8anc5r.webp",
          "https://res.cloudinary.com/dhbz4atrb/image/upload/v1759229199/myclothes/wbxomj7urmqat5hcau4f.webp",
          "https://res.cloudinary.com/dhbz4atrb/image/upload/v1759229200/myclothes/cd9arouxfscdxrhxofl7.webp",
          "https://res.cloudinary.com/dhbz4atrb/image/upload/v1759229201/myclothes/kexgkpsj04jioghwuqto.webp",
          "https://res.cloudinary.com/dhbz4atrb/image/upload/v1759229202/myclothes/okwwlm4j5rioeoissk36.webp",
        ],
        variants: [
          {
            color: "Đen",
            sizes: [
              { size: "M", stock: 20 },
              { size: "L", stock: 15 },
              { size: "XL", stock: 10 },
            ],
          },
          {
            color: "Be",
            sizes: [
              { size: "M", stock: 18 },
              { size: "L", stock: 12 },
              { size: "XL", stock: 8 },
            ],
          },
          {
            color: "Nâu đậm",
            sizes: [
              { size: "M", stock: 34 },
              { size: "L", stock: 12 },
              { size: "XL", stock: 8 },
            ],
          },
          {
            color: "Trắng",
            sizes: [
              { size: "M", stock: 15 },
              { size: "L", stock: 12 },
              { size: "XL", stock: 8 },
            ],
          },
          {
            color: "Xanh dương đậm",
            sizes: [
              { size: "M", stock: 20 },
              { size: "L", stock: 12 },
              { size: "XL", stock: 8 },
            ],
          },
        ],
      },
      {
        name: "Áo Polo Pique Thoáng Mát Non Branded",
        categoryId: catMap["Áo polo"],
        price: 399000,
        description: "Áo polo pique thoáng mát, không nhăn",
        images: [
          "https://res.cloudinary.com/dhbz4atrb/image/upload/v1759229802/myclothes/tsshifildry7jv4hfyn1.webp",
          "https://res.cloudinary.com/dhbz4atrb/image/upload/v1759229803/myclothes/unwxekfgvquvcjncbqlu.webp",
          "https://res.cloudinary.com/dhbz4atrb/image/upload/v1759229801/myclothes/jbekoqshstsba1jnlfza.webp",
        ],
        variants: [
          {
            color: "Hồng nhạt",
            sizes: [
              { size: "M", stock: 20 },
              { size: "L", stock: 15 },
              { size: "XL", stock: 10 },
            ],
          },
          {
            color: "Xanh nhạt",
            sizes: [
              { size: "M", stock: 18 },
              { size: "L", stock: 12 },
              { size: "XL", stock: 8 },
            ],
          },
          {
            color: "Đen",
            sizes: [
              { size: "M", stock: 34 },
              { size: "L", stock: 12 },
              { size: "XL", stock: 8 },
            ],
          },
        ],
      },

      {
        name: "Áo Polo Pique Mềm Mại Thoáng Mát No Style",
        categoryId: catMap["Áo polo"],
        price: 309000,
        description: "Áo polo pique mềm mại, thoáng mát, không nhăn",
        images: [
          "https://res.cloudinary.com/dhbz4atrb/image/upload/v1759229799/myclothes/msmfxepfngh2t7csbjmv.webp",
          "https://res.cloudinary.com/dhbz4atrb/image/upload/v1759229800/myclothes/dbokcfrz4u7ekngqig8x.webp",
        ],
        variants: [
          {
            color: "Đen",
            sizes: [
              { size: "M", stock: 20 },
              { size: "L", stock: 15 },
              { size: "XL", stock: 10 },
            ],
          },
          {
            color: "Trắng",
            sizes: [
              { size: "M", stock: 18 },
              { size: "L", stock: 12 },
              { size: "XL", stock: 8 },
            ],
          },
        ],
      },

      {
        name: "Áo Polo Pique Thoáng Khí Seventy Seven",
        categoryId: catMap["Áo polo"],
        price: 269000,
        description: "Áo polo pique mềm mại, thoáng mát, không nhăn",
        images: [
          "https://res.cloudinary.com/dhbz4atrb/image/upload/v1759229805/myclothes/kltcodywp6kvbb1bkkbd.webp",
          "https://res.cloudinary.com/dhbz4atrb/image/upload/v1759229804/myclothes/fqt8mogx9cmxwabm95yo.webp",
        ],
        variants: [
          {
            color: "Trắng",
            sizes: [
              { size: "M", stock: 20 },
              { size: "L", stock: 15 },
              { size: "XL", stock: 10 },
            ],
          },
          {
            color: "Nâu",
            sizes: [
              { size: "M", stock: 18 },
              { size: "L", stock: 12 },
              { size: "XL", stock: 8 },
            ],
          },
        ],
      },

      {
        name: "Áo Sơ Mi Caro Tay Dài Mềm Mịn No Style",
        categoryId: catMap["Áo sơ mi dài tay"],
        price: 239000,
        description: "Áo sơ mi caro tay dài mềm mịn, không nhăn",
        images: [
          "https://res.cloudinary.com/dhbz4atrb/image/upload/v1759230776/myclothes/jd3qa8tvpj4ro3qgp4tb.jpg",
          "https://res.cloudinary.com/dhbz4atrb/image/upload/v1759230777/myclothes/mcmf37h9fynetoes1cc5.webp",
        ],
        variants: [
          {
            color: "Nâu",
            sizes: [
              { size: "M", stock: 20 },
              { size: "L", stock: 15 },
              { size: "XL", stock: 10 },
            ],
          },
          {
            color: "Xanh dương",
            sizes: [
              { size: "M", stock: 18 },
              { size: "L", stock: 12 },
              { size: "XL", stock: 8 },
            ],
          },
        ],
      },

      {
        name: "Áo Sơ Mi Tay Dài Modal Ít Nhăn Non Branded 19",
        categoryId: catMap["Áo sơ mi dài tay"],
        price: 139000,
        description: "Áo sơ mi tay dài modal ít nhăn, không cần ủi",
        images: [
          "https://res.cloudinary.com/dhbz4atrb/image/upload/v1759230778/myclothes/mvodp8a8ci4qod9nkd30.webp",
          "https://res.cloudinary.com/dhbz4atrb/image/upload/v1759230779/myclothes/do5u7l7w6up6pkfcwaqb.webp",
          "https://res.cloudinary.com/dhbz4atrb/image/upload/v1759230780/myclothes/wbizwv983vvstg0ohpxv.webp",
          "https://res.cloudinary.com/dhbz4atrb/image/upload/v1759230781/myclothes/et1x2fef1v0fvnrg1por.webp",
          "https://res.cloudinary.com/dhbz4atrb/image/upload/v1759230782/myclothes/uj0nshtiuvs5vwgj45ia.webp",
        ],
        variants: [
          {
            color: "Đỏ tươi",
            sizes: [
              { size: "M", stock: 20 },
              { size: "L", stock: 15 },
              { size: "XL", stock: 10 },
            ],
          },
          {
            color: "Đen",
            sizes: [
              { size: "M", stock: 18 },
              { size: "L", stock: 12 },
              { size: "XL", stock: 8 },
            ],
          },
          {
            color: "Be",
            sizes: [
              { size: "M", stock: 18 },
              { size: "L", stock: 12 },
              { size: "XL", stock: 8 },
            ],
          },
          {
            color: "Trắng",
            sizes: [
              { size: "M", stock: 18 },
              { size: "L", stock: 12 },
              { size: "XL", stock: 8 },
            ],
          },
          {
            color: "Xám nhạt",
            sizes: [
              { size: "M", stock: 18 },
              { size: "L", stock: 12 },
              { size: "XL", stock: 8 },
            ],
          },
        ],
      },

      {
        name: "Áo Sơ Mi Modal Mềm Mịn Ít Nhăn Non Branded 33",
        categoryId: catMap["Áo sơ mi ngắn tay"],
        price: 249000,
        description: "Áo sơ mi tay ngắn modal ít nhăn, không cần ủi",
        images: [
          "https://res.cloudinary.com/dhbz4atrb/image/upload/v1759231405/myclothes/nu8f7pmujullpdywfueb.webp",
          "https://res.cloudinary.com/dhbz4atrb/image/upload/v1759231406/myclothes/iv1oo5itrikpmjkqdje5.webp",
          "https://res.cloudinary.com/dhbz4atrb/image/upload/v1759231406/myclothes/vflbpimflohjxatqjmw3.webp",
          "https://res.cloudinary.com/dhbz4atrb/image/upload/v1759231407/myclothes/fg5xqtzrpgiaw3lmrr1x.webp",
        ],
        variants: [
          {
            color: "Hồng nhạt",
            sizes: [
              { size: "M", stock: 20 },
              { size: "L", stock: 15 },
              { size: "XL", stock: 10 },
            ],
          },
          {
            color: "Đen",
            sizes: [
              { size: "M", stock: 18 },
              { size: "L", stock: 12 },
              { size: "XL", stock: 8 },
            ],
          },
          {
            color: "Be",
            sizes: [
              { size: "M", stock: 18 },
              { size: "L", stock: 12 },
              { size: "XL", stock: 8 },
            ],
          },
          {
            color: "Xanh nhạt",
            sizes: [
              { size: "M", stock: 18 },
              { size: "L", stock: 12 },
              { size: "XL", stock: 8 },
            ],
          },
        ],
      },

      {
        name: "Áo Sơ Mi Tay Ngắn Vải Nhung Corduroy Retro Ít Nhăn Seventy Seven 22",
        categoryId: catMap["Áo sơ mi ngắn tay"],
        price: 349000,
        description:
          "Áo sơ mi tay ngắn vải nhung corduroy retro ít nhăn, không cần ủi",
        images: [
          "https://res.cloudinary.com/dhbz4atrb/image/upload/v1759231408/myclothes/fyjjncn3mdum3mbuglyg.webp",
          "https://res.cloudinary.com/dhbz4atrb/image/upload/v1759231410/myclothes/twsshzexge7jd595ssc5.webp",
          "https://res.cloudinary.com/dhbz4atrb/image/upload/v1759231411/myclothes/lcfdbu6spoqnsml7kosu.webp",
          "https://res.cloudinary.com/dhbz4atrb/image/upload/v1759231413/myclothes/dlrk2f1zi7puvccr1nqk.jpg",
        ],
        variants: [
          {
            color: "Nâu be",
            sizes: [
              { size: "M", stock: 20 },
              { size: "L", stock: 15 },
              { size: "XL", stock: 10 },
            ],
          },
          {
            color: "Đen",
            sizes: [
              { size: "M", stock: 18 },
              { size: "L", stock: 12 },
              { size: "XL", stock: 8 },
            ],
          },
          {
            color: "Nâu",
            sizes: [
              { size: "M", stock: 18 },
              { size: "L", stock: 12 },
              { size: "XL", stock: 8 },
            ],
          },
          {
            color: "Xanh",
            sizes: [
              { size: "M", stock: 18 },
              { size: "L", stock: 12 },
              { size: "XL", stock: 8 },
            ],
          },
        ],
      },

      {
        name: "Áo Thun Cotton Line Art Co Giãn Seventy Seven",
        categoryId: catMap["Áo thun tay ngắn"],
        price: 249000,
        description: "Áo thun cotton co giãn với thiết kế line art độc đáo",
        images: [
          "https://res.cloudinary.com/dhbz4atrb/image/upload/v1759231903/myclothes/izphxjzrxj9jarxzh7af.webp",
          "https://res.cloudinary.com/dhbz4atrb/image/upload/v1759231904/myclothes/q0aoi8nqxiaamfgifayt.webp",
          "https://res.cloudinary.com/dhbz4atrb/image/upload/v1759231905/myclothes/qjvyif3lagv2kumc3fjx.webp",
          "https://res.cloudinary.com/dhbz4atrb/image/upload/v1759231906/myclothes/uifjxivvaj4dppixidhs.webp",
        ],
        variants: [
          {
            color: "Hồng nhạt",
            sizes: [
              { size: "M", stock: 20 },
              { size: "L", stock: 15 },
              { size: "XL", stock: 10 },
            ],
          },
          {
            color: "Nâu",
            sizes: [
              { size: "M", stock: 20 },
              { size: "L", stock: 12 },
              { size: "XL", stock: 8 },
            ],
          },
          {
            color: "Be ",
            sizes: [
              { size: "M", stock: 18 },
              { size: "L", stock: 12 },
              { size: "XL", stock: 8 },
            ],
          },
          {
            color: "Trắng",
            sizes: [
              { size: "M", stock: 18 },
              { size: "L", stock: 12 },
              { size: "XL", stock: 8 },
            ],
          },
        ],
      },

      {
        name: "Áo Thun Tay Ngắn Waffle Thoáng Khí Seventy Seven 10",
        categoryId: catMap["Áo thun tay ngắn"],
        price: 229000,
        description: "Áo thun tay ngắn vải waffle thoáng khí, co giãn tốt",
        images: [
          "https://res.cloudinary.com/dhbz4atrb/image/upload/v1759231907/myclothes/ulm1g6bk0uemgh7hxfqx.jpg",
          "https://res.cloudinary.com/dhbz4atrb/image/upload/v1759231908/myclothes/ah5kl8twsdrslgbeaoyd.jpg",
          "https://res.cloudinary.com/dhbz4atrb/image/upload/v1759231909/myclothes/fk7v67aafxczqzoxudcq.jpg",
          "https://res.cloudinary.com/dhbz4atrb/image/upload/v1759231910/myclothes/mfnxki6tv0ozbydkzacr.jpg",
        ],
        variants: [
          {
            color: "Đen",
            sizes: [
              { size: "M", stock: 20 },
              { size: "L", stock: 15 },
              { size: "XL", stock: 10 },
            ],
          },
          {
            color: "Nâu nhạt",
            sizes: [
              { size: "M", stock: 18 },
              { size: "L", stock: 12 },
              { size: "XL", stock: 8 },
            ],
          },
          {
            color: "Trắng",
            sizes: [
              { size: "M", stock: 18 },
              { size: "L", stock: 12 },
              { size: "XL", stock: 8 },
            ],
          },
          {
            color: "Xám nhạt",
            sizes: [
              { size: "M", stock: 18 },
              { size: "L", stock: 12 },
              { size: "XL", stock: 8 },
            ],
          },
        ],
      },

      {
        name: "Áo Thun Tay Ngắn Waffle Thoáng Khí Seventy Seven 10",
        categoryId: catMap["Áo thun tay dài"],
        price: 239000,
        description: "Áo thun tay ngắn vải waffle thoáng khí, co giãn tốt",
        images: [
          "https://res.cloudinary.com/dhbz4atrb/image/upload/v1759232465/myclothes/nykxgkjfqez2ztedoxie.webp",
          "https://res.cloudinary.com/dhbz4atrb/image/upload/v1759232466/myclothes/u4ul6etbqhzhezdgpuxj.webp",
          "https://res.cloudinary.com/dhbz4atrb/image/upload/v1759232467/myclothes/jawefyehoi2kkzxzamfi.webp",
          "https://res.cloudinary.com/dhbz4atrb/image/upload/v1759232468/myclothes/tlr8fbmfpismxq2tr5xx.webp",
          "https://res.cloudinary.com/dhbz4atrb/image/upload/v1759232469/myclothes/wg4xyyieacqc5fiury2l.webp",
          "https://res.cloudinary.com/dhbz4atrb/image/upload/v1759232470/myclothes/iayfohsiqp0ybj7q0fl0.webp",
        ],
        variants: [
          {
            color: "Đen",
            sizes: [
              { size: "M", stock: 20 },
              { size: "L", stock: 15 },
              { size: "XL", stock: 10 },
            ],
          },
          {
            color: "Trắng",
            sizes: [
              { size: "M", stock: 18 },
              { size: "L", stock: 12 },
              { size: "XL", stock: 8 },
            ],
          },
          {
            color: "Be",
            sizes: [
              { size: "M", stock: 18 },
              { size: "L", stock: 12 },
              { size: "XL", stock: 8 },
            ],
          },
          {
            color: "Nâu",
            sizes: [
              { size: "M", stock: 18 },
              { size: "L", stock: 12 },
              { size: "XL", stock: 8 },
            ],
          },
          {
            color: "Xám đen",
            sizes: [
              { size: "M", stock: 20 },
              { size: "L", stock: 15 },
              { size: "XL", stock: 10 },
            ],
          },
          {
            color: "Xanh đậm",
            sizes: [
              { size: "M", stock: 20 },
              { size: "L", stock: 15 },
              { size: "XL", stock: 10 },
            ],
          },
        ],
      },

      {
        name: "Quần Jogger Thun Sorona Mềm Mại Non Branded 41",
        categoryId: catMap["Quần dài jogger"],
        price: 429000,
        description: "Quần jogger thun sorona mềm mại, co giãn tốt",
        images: [
          "https://res.cloudinary.com/dhbz4atrb/image/upload/v1759232751/myclothes/eke4aqcvjmh2ihievbth.webp",
          "https://res.cloudinary.com/dhbz4atrb/image/upload/v1759232752/myclothes/syglcda3hwc1a9vrbccv.webp",
          "https://res.cloudinary.com/dhbz4atrb/image/upload/v1759232753/myclothes/lzj3ya3drdmgddzmilvw.webp",
          "https://res.cloudinary.com/dhbz4atrb/image/upload/v1759232755/myclothes/tvqmgoxdgrmwbwpgfcuy.webp",
          "https://res.cloudinary.com/dhbz4atrb/image/upload/v1759232756/myclothes/uby21v6oo6uejccw124g.webp",
        ],
        variants: [
          {
            color: "Vàng đậm",
            sizes: [
              { size: "M", stock: 20 },
              { size: "L", stock: 15 },
              { size: "XL", stock: 10 },
            ],
          },
          {
            color: "Be",
            sizes: [
              { size: "M", stock: 18 },
              { size: "L", stock: 12 },
              { size: "XL", stock: 8 },
            ],
          },
          {
            color: "Xanh chì",
            sizes: [
              { size: "M", stock: 18 },
              { size: "L", stock: 12 },
              { size: "XL", stock: 8 },
            ],
          },
          {
            color: "Xanh navy",
            sizes: [
              { size: "M", stock: 18 },
              { size: "L", stock: 12 },
              { size: "XL", stock: 8 },
            ],
          },
          {
            color: "Xanh đậm",
            sizes: [
              { size: "M", stock: 20 },
              { size: "L", stock: 15 },
              { size: "XL", stock: 10 },
            ],
          },
        ],
      },

      {
        name: "Quần Tây Smart Casual Ít Nhăn The CEO 018",
        categoryId: catMap["Quần dài tây"],
        price: 359000,
        description: "Quần tây smart casual ít nhăn, phong cách lịch sự",
        images: [
          "https://res.cloudinary.com/dhbz4atrb/image/upload/v1759233312/myclothes/htulhxv4ty4krqwtwidg.webp",
          "https://res.cloudinary.com/dhbz4atrb/image/upload/v1759233313/myclothes/ty8ap2mqgb5nbcwytxuo.webp",
          "https://res.cloudinary.com/dhbz4atrb/image/upload/v1759233314/myclothes/esle6eoskco9whkzofao.webp",
        ],
        variants: [
          {
            color: "Đen",
            sizes: [
              { size: "M", stock: 20 },
              { size: "L", stock: 15 },
              { size: "XL", stock: 10 },
            ],
          },
          {
            color: "Xám nhạt",
            sizes: [
              { size: "M", stock: 18 },
              { size: "L", stock: 12 },
              { size: "XL", stock: 8 },
            ],
          },
          {
            color: "Xám",
            sizes: [
              { size: "M", stock: 18 },
              { size: "L", stock: 12 },
              { size: "XL", stock: 8 },
            ],
          },
        ],
      },

      {
        name: "Quần Kaki Chinos Co Giãn Thoáng Mát The Minimalist 011",
        categoryId: catMap["Quần dài kaki"],
        price: 369000,
        description: "Quần kaki chinos co giãn thoáng mát, phong cách tối giản",
        images: [
          "https://res.cloudinary.com/dhbz4atrb/image/upload/v1759232954/myclothes/uqn4saovqgbomr9tmico.webp",
          "https://res.cloudinary.com/dhbz4atrb/image/upload/v1759232955/myclothes/unnl8lemyvjjapl1fjnf.webp",
          "https://res.cloudinary.com/dhbz4atrb/image/upload/v1759232956/myclothes/v8nawzogepsy26t8h90g.webp",
          "https://res.cloudinary.com/dhbz4atrb/image/upload/v1759232957/myclothes/wxlwyfityze4z1slbdn6.webp",
        ],
        variants: [
          {
            color: "Đen",
            sizes: [
              { size: "M", stock: 20 },
              { size: "L", stock: 15 },
              { size: "XL", stock: 10 },
            ],
          },
          {
            color: "Cam đất",
            sizes: [
              { size: "M", stock: 18 },
              { size: "L", stock: 12 },
              { size: "XL", stock: 8 },
            ],
          },
          {
            color: "Xám chì",
            sizes: [
              { size: "M", stock: 18 },
              { size: "L", stock: 12 },
              { size: "XL", stock: 8 },
            ],
          },
          {
            color: "Đen nhạt",
            sizes: [
              { size: "M", stock: 18 },
              { size: "L", stock: 12 },
              { size: "XL", stock: 8 },
            ],
          },
        ],
      },

      {
        name: "Quần Jeans Slimfit Co Giãn The Original 28",
        categoryId: catMap["Quần jean slim-fit"],
        price: 489000,
        description: "Quần jeans slimfit co giãn, phong cách hiện đại",
        images: [
          "https://res.cloudinary.com/dhbz4atrb/image/upload/v1759233587/myclothes/inxm6fg7fasatygkshs8.webp",
          "https://res.cloudinary.com/dhbz4atrb/image/upload/v1759233589/myclothes/jqj31befd4wagzmymrzn.jpg",
          "https://res.cloudinary.com/dhbz4atrb/image/upload/v1759233590/myclothes/lm5w3ahuodhqdcyulrjr.webp",
          "https://res.cloudinary.com/dhbz4atrb/image/upload/v1759233592/myclothes/gj0y16ba4vokdb5acmcv.jpg",
        ],
        variants: [
          {
            color: "Trắng nhạt",
            sizes: [
              { size: "M", stock: 20 },
              { size: "L", stock: 15 },
              { size: "XL", stock: 10 },
            ],
          },
          {
            color: "Xám nhạt",
            sizes: [
              { size: "M", stock: 18 },
              { size: "L", stock: 12 },
              { size: "XL", stock: 8 },
            ],
          },
          {
            color: "Xanh đậm",
            sizes: [
              { size: "M", stock: 18 },
              { size: "L", stock: 12 },
              { size: "XL", stock: 8 },
            ],
          },
          {
            color: "Xanh nhạt",
            sizes: [
              { size: "M", stock: 18 },
              { size: "L", stock: 12 },
              { size: "XL", stock: 8 },
            ],
          },
        ],
      },

      {
        name: "Quần Jeans Loose Fit Bền Bỉ Multi-Color Jean",
        categoryId: catMap["Quần jean loose-fit"],
        price: 289000,
        description: "Quần jeans loose fit bền bỉ, phong cách hiện đại",
        images: [
          "https://res.cloudinary.com/dhbz4atrb/image/upload/v1759233680/myclothes/k1mgwlll3xrbhxlvzqpm.webp",
          "https://res.cloudinary.com/dhbz4atrb/image/upload/v1759233681/myclothes/a9i5e0ybjmkju60x6obm.webp",
          "https://res.cloudinary.com/dhbz4atrb/image/upload/v1759233682/myclothes/stlwhrgiwxznlhut0mgc.webp",
          "https://res.cloudinary.com/dhbz4atrb/image/upload/v1759233683/myclothes/b1qpxsuzbxyccvdky9ju.webp",
          "https://res.cloudinary.com/dhbz4atrb/image/upload/v1759233684/myclothes/fodyevpfdzi2efysjto7.webp",
        ],
        variants: [
          {
            color: "Nâu nhạt",
            sizes: [
              { size: "M", stock: 20 },
              { size: "L", stock: 15 },
              { size: "XL", stock: 10 },
            ],
          },
          {
            color: "Xám chì",
            sizes: [
              { size: "M", stock: 18 },
              { size: "L", stock: 12 },
              { size: "XL", stock: 8 },
            ],
          },
          {
            color: "Xám xanh",
            sizes: [
              { size: "M", stock: 18 },
              { size: "L", stock: 12 },
              { size: "XL", stock: 8 },
            ],
          },
          {
            color: "Nâu nhạt",
            sizes: [
              { size: "M", stock: 18 },
              { size: "L", stock: 12 },
              { size: "XL", stock: 8 },
            ],
          },
          {
            color: "Xám nhạt",
            sizes: [
              { size: "M", stock: 18 },
              { size: "L", stock: 12 },
              { size: "XL", stock: 8 },
            ],
          },
        ],
      },

      {
        name: "Quần Short Thun 9 Inch Thoáng Mát Non Branded 05",
        categoryId: catMap["Quần short thun"],
        price: 199000,
        description: "Quần short thun 9 inch thoáng mát, phong cách hiện đại",
        images: [
          "https://res.cloudinary.com/dhbz4atrb/image/upload/v1759234047/myclothes/ofpmbgrpbb1gptjypfqz.webp",
          "https://res.cloudinary.com/dhbz4atrb/image/upload/v1759234048/myclothes/md3odtipeg0wuqrhhefn.webp",
          "https://res.cloudinary.com/dhbz4atrb/image/upload/v1759234050/myclothes/kaevmicjodpgo40hbttj.jpg",
          "https://res.cloudinary.com/dhbz4atrb/image/upload/v1759234052/myclothes/k2xcihgi1kpviwkhd2f1.webp",
        ],
        variants: [
          {
            color: "Trắng ",
            sizes: [
              { size: "M", stock: 20 },
              { size: "L", stock: 15 },
              { size: "XL", stock: 10 },
            ],
          },
          {
            color: "Nâu",
            sizes: [
              { size: "M", stock: 18 },
              { size: "L", stock: 12 },
              { size: "XL", stock: 8 },
            ],
          },
          {
            color: "Đen",
            sizes: [
              { size: "M", stock: 18 },
              { size: "L", stock: 12 },
              { size: "XL", stock: 8 },
            ],
          },
          {
            color: "Xanh đậm",
            sizes: [
              { size: "M", stock: 18 },
              { size: "L", stock: 12 },
              { size: "XL", stock: 8 },
            ],
          },
        ],
      },

      {
        name: "Quần Short Kaki 7 Inch Co Giãn No Style M92",
        categoryId: catMap["Quần short kaki"],
        price: 100000,
        description: "Quần short kaki 7 inch co giãn, phong cách hiện đại",
        images: [
          "https://res.cloudinary.com/dhbz4atrb/image/upload/v1759234062/myclothes/oqfybyym8eoj29vu2adu.webp",
          "https://res.cloudinary.com/dhbz4atrb/image/upload/v1759234064/myclothes/fmxabbcnsz3rnvzna9ud.webp",
          "https://res.cloudinary.com/dhbz4atrb/image/upload/v1759234066/myclothes/ocvkuxv2sa7e3mmtt9kg.webp",
          "https://res.cloudinary.com/dhbz4atrb/image/upload/v1759234067/myclothes/lf0y5xlabveyqijhemgb.webp",
        ],
        variants: [
          {
            color: "Be",
            sizes: [
              { size: "M", stock: 20 },
              { size: "L", stock: 15 },
              { size: "XL", stock: 10 },
            ],
          },
          {
            color: "Xám chì",
            sizes: [
              { size: "M", stock: 18 },
              { size: "L", stock: 12 },
              { size: "XL", stock: 8 },
            ],
          },
          {
            color: "Trắng",
            sizes: [
              { size: "M", stock: 18 },
              { size: "L", stock: 12 },
              { size: "XL", stock: 8 },
            ],
          },
          {
            color: "Xám xanh",
            sizes: [
              { size: "M", stock: 18 },
              { size: "L", stock: 12 },
              { size: "XL", stock: 8 },
            ],
          },
        ],
      },

      {
        name: "Dây Nịt Da Bò Khóa Tự Động phong cách lịch sự",
        categoryId: catMap["Dây nịt"],
        price: 99000,
        description: "Dây nịt da bò khóa tự động, phong cách hiện đại",
        images: [
          "https://res.cloudinary.com/dhbz4atrb/image/upload/v1759234477/myclothes/bjnurcdbutxilliel3zk.webp",
        ],
      },
      {
        name: "Dây Nịt Da Bò Khóa Tự Động đẹp mắt",
        categoryId: catMap["Dây nịt"],
        price: 119000,
        description: "Dây nịt da bò khóa tự động, phong cách hiện đại",
        images: [
          "https://res.cloudinary.com/dhbz4atrb/image/upload/v1759234478/myclothes/g1fnine7daivgoxm6kxm.webp",
        ],
      },
      {
        name: "Dây Nịt Da Bò Khóa Tự Động sang trọng",
        categoryId: catMap["Dây nịt"],
        price: 109000,
        description: "Dây nịt da bò khóa tự động, phong cách hiện đại",
        images: [
          "https://res.cloudinary.com/dhbz4atrb/image/upload/v1759234479/myclothes/fkbt1qru13ecyersealz.webp",
        ],
      },

      {
        name: "Mũ Dad Hat Dù Mỏng Nhẹ Mesh Thoáng Khí",
        categoryId: catMap["Mũ"],
        price: 69000,
        description:
          "Nón Dad Hat Dù Mỏng Nhẹ Mesh Thoáng Khí, phong cách hiện đại",
        images: [
          "https://res.cloudinary.com/dhbz4atrb/image/upload/v1759234739/myclothes/erslkic7ednmrbxvg61n.webp",
          "https://res.cloudinary.com/dhbz4atrb/image/upload/v1759234741/myclothes/z13g243srjnz3bqq8xqs.webp",
        ],
        variants: [
          {
            color: "Đen",
          },
          {
            color: "Trắng",
          },
        ],
      },

      {
        name: "Vớ Cổ Ngắn Công Thái Học 90° Dệt Lưới Thoáng Khí",
        categoryId: catMap["Vớ"],
        price: 10000,
        description:
          "Vớ Cổ Ngắn Công Thái Học 90° Dệt Lưới Thoáng Khí, phong cách hiện đại",
        images: [
          "https://res.cloudinary.com/dhbz4atrb/image/upload/v1759234912/myclothes/sddfbrwanz0ugqbqfypk.jpg",
          "https://res.cloudinary.com/dhbz4atrb/image/upload/v1759234914/myclothes/y6suj4hsrlbnmfuoehqa.jpg",
          "https://res.cloudinary.com/dhbz4atrb/image/upload/v1759234916/myclothes/dgl6gwphrugzq0snx8sb.jpg",
        ],
        variants: [
          {
            color: "Đen",
          },
          {
            color: "Trắng",
          },
          {
            color: "Xám",
          },
        ],
      },

      {
        name: "Ví Ngang Canvas Bền Nhẹ Đẹp Mắt",
        categoryId: catMap["Ví"],
        price: 69000,
        description: "Ví ngang canvas đẹp mắt, phong cách hiện đại",
        images: [
          "https://res.cloudinary.com/dhbz4atrb/image/upload/v1759234477/myclothes/bjnurcdbutxilliel3zk.webp",
        ],
      },
      {
        name: "Ví Ngang Canvas Bền Nhẹ NB",
        categoryId: catMap["Ví"],
        price: 79000,
        description: "Ví ngang canvas bền nhẹ, phong cách hiện đại",
        images: [
          "https://res.cloudinary.com/dhbz4atrb/image/upload/v1759234478/myclothes/g1fnine7daivgoxm6kxm.webp",
        ],
      },
      {
        name: "Ví Ngang Da Bò Thật Bền Bỉ",
        categoryId: catMap["Ví"],
        price: 109000,
        description: "Ví ngang da bò thật bền bỉ, phong cách hiện đại",
        images: [
          "https://res.cloudinary.com/dhbz4atrb/image/upload/v1759234479/myclothes/fkbt1qru13ecyersealz.webp",
        ],
      },
    ];
    await Product.insertMany(products);
    console.log("✅ Thêm products thành công");
  } catch (err) {
    console.error("❌ Lỗi khi thêm dữ liệu:", err);
  }
}
seed();
