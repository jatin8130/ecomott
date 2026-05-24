import { NextRequest, NextResponse as res } from "next/server";
import serverCatchError from "@/lib/server-catch-error";
import OrderModel from "@/models/order.model";
import { getServerSession } from "next-auth";
import { authOption } from "../auth/[...nextauth]/route";
import { connectDB } from "@/lib/db";

export const POST = async (req: NextRequest) => {
  try {
    await connectDB()
    const session = await getServerSession(authOption);

    if (!session) return res.json({ message: "Unauthorized" }, { status: 401 });

    if (session.user.role !== "user")
      return res.json({ message: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    body.user = session.user.id;
    const order = await OrderModel.create(body);
    return res.json(order);
  } catch (err) {
    return serverCatchError(err);
  }
};

export const GET = async () => {
  try {
    await connectDB()
    const session = await getServerSession(authOption);

    if (!session) return res.json({ message: "Unauthorized" }, { status: 401 });

    let orders = [];
    const role = session.user.role;
    const id = session.user.id;

    if (role === "user") {
      orders = await OrderModel.find({ user: id })
        .sort({ createdAt: -1 })
        .populate("products");
    }

    if (role === "admin") {
      orders = await OrderModel.find({ user: id })
        .sort({ createdAt: -1 })
        .populate("user", "fullname email mobile")
        .populate("products");
    }

    return res.json(orders);
  } catch (err) {
    return serverCatchError(err);
  }
};
