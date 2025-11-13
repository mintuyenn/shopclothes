import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

// Cấu hình cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const folderPath = "D:/anh-tam/phukien/vi"; // thư mục local chứa ảnh
const cloudFolder = "myclothes"; // folder trên Cloudinary

async function uploadImages() {
  const files = fs.readdirSync(folderPath);
  const uploadedUrls = []; // mảng lưu link ảnh

  for (const file of files) {
    const filePath = path.join(folderPath, file);

    if (fs.lstatSync(filePath).isFile()) {
      try {
        const result = await cloudinary.uploader.upload(filePath, {
          folder: cloudFolder,
        });
        uploadedUrls.push(result.secure_url); // lưu link
        console.log("Uploaded:", result.secure_url);
      } catch (err) {
        console.error("Upload error:", err);
      }
    }
  }

  // In ra toàn bộ link sau khi upload xong
  console.log("\nTất cả link ảnh:");
  uploadedUrls.forEach((url) => console.log(url));
}

uploadImages();
