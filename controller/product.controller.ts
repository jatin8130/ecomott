import ProductModel from "@/models/product.model";
import { connectDB } from "@/lib/db";
import { unstable_cache } from "next/cache";

const getProductsFromDB = async (page = 1, limit = 12) => {
  await connectDB();

  const skip = (page - 1) * limit;

  const [total, data] = await Promise.all([
    ProductModel.countDocuments(),
    ProductModel.find().sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
  ]);

  return {
    total,
    data: data.map((item) => ({
      id: item._id.toString(),
      title: item.title,
      description: item.description,
      price: item.price,
      discount: item.discount,
      quantity: item.quantity,
      image: item.image,
      slug: item.slug,
      createdAt: item.createdAt ? item.createdAt.toISOString() : null,
      updatedAt: item.updatedAt ? item.updatedAt.toISOString() : null,
    })),
  };
};

export const fetchProduct = unstable_cache(
  async (page = 1, limit = 12) => {
    return getProductsFromDB(page, limit);
  },
  ["products"],
  {
    revalidate: 300,
    tags: ["products"],
  },
);

export const fetchProductSlugs = async () => {
  await connectDB();
  return ProductModel.distinct("slug"); // already safe (returns array of strings)
};

export const fetchProductBySlugs = async (slug: string) => {
  await connectDB();

  const product = await ProductModel.findOne({ slug }).lean();

  if (!product) return null;

  return {
    id: product._id.toString(),
    title: product.title,
    description: product.description,
    price: product.price,
    discount: product.discount,
    quantity: product.quantity,
    image: product.image,
    slug: product.slug,
    createdAt: product.createdAt ? product.createdAt.toISOString() : null,
    updatedAt: product.updatedAt ? product.updatedAt.toISOString() : null,
  };
};
