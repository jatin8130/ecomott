const db = `${process.env.DB_URL}/${process.env.DB_NAME}`;
import serverCatchError from "@/lib/server-catch-error";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
mongoose.connect(db);

import { NextRequest, NextResponse as res } from "next/server";
import { authOption } from "../auth/[...nextauth]/route";
import CartModel from "@/models/cart.model";

export const POST = async (req: NextRequest) => {
  try {
    const session = await getServerSession(authOption);

    if (!session) return res.json({ message: "Unauthorized" }, { status: 401 });

    if (session.user.role !== "user")
      return res.json({ message: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    body.user = session.user.id;

    const update = await CartModel.findOneAndUpdate(
      { user: body.user, product: body.product },
      { $inc: { qnt: 1 } },
      { returnDocument: "after" },
    );

    if (update) return res.json(update);

    const cart = await CartModel.create(body);
    return res.json(cart);
  } catch (err) {
    return serverCatchError(err);
  }
};

export const GET = async (req: NextRequest) => {
  try {
    const session = await getServerSession(authOption);

    if (!session) return res.json({ message: "Unauthorized" }, { status: 401 });

    if (session.user.role !== "user")
      return res.json({ message: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);

    if (searchParams.get("count")) {
      const count = await CartModel.countDocuments({ user: session.user.id });
      return res.json({ count });
    }

    const carts = await CartModel.find({ user: session.user.id }).populate(
      "product",
    );
    return res.json(carts);
  } catch (err) {
    return serverCatchError(err);
  }
};
