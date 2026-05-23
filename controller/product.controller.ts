const db = `${process.env.DB_URL}/${process.env.DB_NAME}`;
import ProductModel from "@/models/product.model";
import mongoose from "mongoose";
mongoose.connect(db);

export const fetchProduct = async (page: number = 1, limit: number = 12) => {
  const skip = (page - 1) * limit;
  const total = await ProductModel.countDocuments();
  const data = await ProductModel.find()
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);
  return { total, data };
};

export const fetchProductSlugs = async () => {
  const slugs = await ProductModel.distinct("slug");
  return slugs;
};

export const fetchProductBySlugs = async (slug: string) => {
  const product = await ProductModel.findOne({ slug });
  return product;
};
