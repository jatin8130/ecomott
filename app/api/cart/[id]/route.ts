import { NextRequest, NextResponse as res } from "next/server";
import serverCatchError from "@/lib/server-catch-error";
import { getServerSession } from "next-auth";
import IdInterface from "@/interfaces/id.interface";
import { authOption } from "../../auth/[...nextauth]/route";
import CartModel from "@/models/cart.model";
import { connectDB } from "@/lib/db";

export const PUT = async (req: NextRequest, context: IdInterface) => {
  try {
    await connectDB()
    const session = await getServerSession(authOption);

    if (!session) return res.json({ message: "Unauthorized" }, { status: 401 });

    if (session.user.role !== "user")
      return res.json({ message: "Unauthorized" }, { status: 401 });

    const { id } = await context.params;
    const body = await req.json();

    let cart = null;

    if (body.qnt > 0) {
      cart = await CartModel.findByIdAndUpdate(
        id,
        { qnt: body.qnt },
        { returnDocument: "after" },
      );
    } else {
      cart = await CartModel.findByIdAndDelete(id);
    }

    if (!cart) return res.json({ message: "Cart not found" }, { status: 404 });

    return res.json(cart);
  } catch (err) {
    return serverCatchError(err);
  }
};

export const DELETE = async (req: NextRequest, context: IdInterface) => {
  try {
    await connectDB()
    const session = await getServerSession(authOption);

    if (!session) return res.json({ message: "Unauthorized" }, { status: 401 });

    if (session.user.role !== "user")
      return res.json({ message: "Unauthorized" }, { status: 401 });

    const { id } = await context.params;
    const cart = await CartModel.findByIdAndDelete(id);

    if (!cart) return res.json({ message: "Cart not found" }, { status: 404 });

    return res.json(cart);
  } catch (err) {
    return serverCatchError(err);
  }
};
