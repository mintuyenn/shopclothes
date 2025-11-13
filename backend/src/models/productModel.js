import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  price: { type: Number, required: true },
  description: { type: String },
  images: [String],
  variants: [
    {
      color: String,
      sizes: [
        {
          size: String,
          stock: Number,
        },
      ],
      images: [String],
    },
  ],
});

const Product = mongoose.model("Product", productSchema);
export default Product;
