const db = `${process.env.DB_URL}/${process.env.DB_NAME}`;
import serverCatchError from "@/lib/server-catch-error";
import PaymentModel from "@/models/payment.model";
import mongoose from "mongoose";
import { NextRequest, NextResponse as res } from "next/server";
import { authOption } from "../auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
mongoose.connect(db);

export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();
    const payment = await PaymentModel.create(body);
    return res.json(payment);
  } catch (err) {
    return serverCatchError(err);
  }
};

export const GET = async () => {
  try {
    const session = await getServerSession(authOption);
    if (!session) return res.json({ message: "unauthorized" }, { status: 401 });

    if (session.user.role !== "admin")
      return res.json({ message: "unauthorized" }, { status: 401 });

    const payment = await PaymentModel.find()
      .sort({ createdAt: -1 })
      .populate("user", "fullname email");

    return res.json(payment);
  } catch (err) {
    return serverCatchError(err);
  }
};
