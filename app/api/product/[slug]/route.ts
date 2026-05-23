const db = `${process.env.DB_URL}/${process.env.DB_NAME}`;
import mongoose from "mongoose";
mongoose.connect(db);

import serverCatchError from "@/lib/server-catch-error";
import { NextRequest, NextResponse as res } from "next/server";
import ProductModel from "@/models/product.model";
import SlugInterface from "@/interfaces/slug.interface";
import { getServerSession } from "next-auth";
import { authOption } from "../../auth/[...nextauth]/route";
import { fetchProductBySlugs } from "@/controller/product.controller";

export const GET = async (req: NextRequest, context: SlugInterface) => {
  try {
    const { slug } = await context.params;
    const product = fetchProductBySlugs(slug);

    if (!product)
      return res.json({ message: "Product not found" }, { status: 404 });

    return res.json(product);
  } catch (err) {
    return serverCatchError(err);
  }
};

export const PUT = async (req: NextRequest, context: SlugInterface) => {
  try {
    const session = await getServerSession(authOption);
    if (!session) return res.json({ message: "unauthorized" }, { status: 401 });

    if (session.user.role !== "admin")
      return res.json({ message: "unauthorized" }, { status: 401 });

    const { slug: id } = await context.params;
    const body = await req.json();
    const product = await ProductModel.findByIdAndUpdate(id, body, {
      returnDocument: "after",
    });

    if (!product)
      return res.json({ message: "Product not found" }, { status: 404 });

    return res.json(product);
  } catch (err) {
    return serverCatchError(err);
  }
};

export const DELETE = async (req: NextRequest, context: SlugInterface) => {
  try {
    const session = await getServerSession(authOption);
    if (!session) return res.json({ message: "unauthorized" }, { status: 401 });

    if (session.user.role !== "admin")
      return res.json({ message: "unauthorized" }, { status: 401 });

    const { slug: id } = await context.params;
    const product = await ProductModel.findByIdAndDelete(id);

    if (!product)
      return res.json({ message: "Product not found" }, { status: 404 });

    return res.json(product);
  } catch (err) {
    return serverCatchError(err);
  }
};
