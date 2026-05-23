const db = `${process.env.DB_URL}/${process.env.DB_NAME}`;
import serverCatchError from "@/lib/server-catch-error";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse as res } from "next/server";
import Razorpay from "razorpay";
import { authOption } from "../../auth/[...nextauth]/route";
mongoose.connect(db);

const rzp = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export const POST = async (req: NextRequest) => {
  try {
    const session = await getServerSession(authOption);

    if (!session) return res.json({ message: "Unauthorized" }, { status: 401 });

    if (session.user.role !== "user")
      return res.json({ message: "Unauthorized" }, { status: 401 });

    const body = await req.json();

    const payload = {
      amount: Number(body.amount) * 100,
      currency: "INR",
    };

    const order = await rzp.orders.create(payload);
    return res.json(order);
  } catch (err) {
    return serverCatchError(err);
  }
};
