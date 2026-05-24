import { v4 as uuid } from "uuid";
import serverCatchError from "@/lib/server-catch-error";
import { NextRequest, NextResponse as res } from "next/server";
import ProductModel from "@/models/product.model";
import fs from "fs";
import path from "path";
import { getServerSession } from "next-auth";
import { authOption } from "../auth/[...nextauth]/route";
import {
  fetchProduct,
  fetchProductSlugs,
} from "@/controller/product.controller";
import { connectDB } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    await connectDB()
    const session = await getServerSession(authOption);
    if (!session) return res.json({ message: "unauthorized" }, { status: 401 });

    if (session.user.role !== "admin")
      return res.json({ message: "unauthorized" }, { status: 401 });

    const body = await req.formData();

    const file = body.get("image") as File | null;

    if (!file) {
      return res.json({ message: "Product image not sent" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const root = process.cwd();
    const folder = path.join(root, "public", "products");

    if (!fs.existsSync(folder)) {
      fs.mkdirSync(folder, { recursive: true });
    }

    const filename = `${uuid()}.png`;
    const filepath = path.join(folder, filename);

    fs.writeFileSync(filepath, buffer);

    const productData = {
      title: body.get("title"),
      price: Number(body.get("price")),
      discount: Number(body.get("discount")),
      quantity: Number(body.get("quantity")),
      description: body.get("description"),
      image: `/products/${filename}`,
    };

    const product = await ProductModel.create(productData);

    return res.json(product);
  } catch (err) {
    return serverCatchError(err);
  }
}

export async function GET(req: NextRequest) {
  try {
    await connectDB()
    const { searchParams } = new URL(req.url);
    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 16;
    const slug = searchParams.get("slug");
    const search = searchParams.get("search");
    const skip = (page - 1) * limit;
    const total = await ProductModel.countDocuments();

    if (search) {
      const products = await ProductModel.find({ title: RegExp(search, "i") })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);
      return res.json({ total, data: products });
    }

    if (slug) {
      const slugs = fetchProductSlugs();
      return res.json(slugs);
    }

    const products = await fetchProduct();

    return res.json({ total, data: products });
  } catch (err) {
    return serverCatchError(err);
  }
}
