import { MongoClient } from "mongodb";

// Dùng URI Mongo Atlas
const uri =
  "mongodb+srv://minhtuyen:3G0iwG7Ng0beNd5V@cluster0.xsqzxcg.mongodb.net/shopquanao?retryWrites=true&w=majority&appName=Cluster0";
const dbName = "shopquanao"; // đổi thành DB bạn dùng trên Atlas

async function migrate() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log("✅ Đã kết nối Mongo Atlas");

    const db = client.db(dbName);
    const products = db.collection("products");

    // Lấy tất cả sản phẩm
    const allProducts = await products.find({}).toArray();

    for (const product of allProducts) {
      if (!product.images || !product.variants) continue;

      const perVariant =
        Math.floor(product.images.length / product.variants.length) || 1;

      const newVariants = product.variants.map((variant, index) => {
        const start = index * perVariant;
        const end = start + perVariant;
        return {
          ...variant,
          images: product.images.slice(start, end),
        };
      });

      await products.updateOne(
        { _id: product._id },
        {
          $set: { variants: newVariants },
          $unset: { images: "" }, // xoá field images ngoài
        }
      );

      console.log(`✅ Migrated product: ${product.name}`);
    }

    console.log("🎉 Hoàn tất migrate!");
  } catch (err) {
    console.error("❌ Lỗi:", err);
  } finally {
    await client.close();
  }
}

migrate();
