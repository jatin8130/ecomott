const db = `${process.env.DB_URL}/${process.env.DB_NAME}`;
import mongoose from "mongoose";
mongoose.connect(db);

import { NextRequest, NextResponse as res } from "next/server";
import serverCatchError from "@/lib/server-catch-error";
import OrderModel from "@/models/order.model";
import { getServerSession } from "next-auth";
import IdInterface from "@/interfaces/id.interface";
import { authOption } from "../../auth/[...nextauth]/route";

export const PUT = async (req: NextRequest, context: IdInterface) => {
  try {
    const session = await getServerSession(authOption);

    if (!session) return res.json({ message: "Unauthorized" }, { status: 401 });

    if (session.user.role !== "admin")
      return res.json({ message: "Unauthorized" }, { status: 401 });

    const { id } = await context.params;
    const body = await req.json();
    const order = await OrderModel.findByIdAndUpdate(
      id,
      { status: body.status },
      { returnDocument: "after" },
    );

    if (!order)
      return res.json({ message: "Order not found" }, { status: 404 });

    return res.json(order);
  } catch (err) {
    return serverCatchError(err);
  }
};
