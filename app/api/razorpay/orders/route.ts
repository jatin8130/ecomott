import serverCatchError from "@/lib/server-catch-error";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse as res } from "next/server";
import Razorpay from "razorpay";
import { authOption } from "../../auth/[...nextauth]/route";
import { connectDB } from "@/lib/db";

const rzp = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,        // ✅ correct
  key_secret: process.env.RAZORPAY_KEY_SECRET!, // ✅ correct
});

export const POST = async (req: NextRequest) => {
  try {
    await connectDB();

    const session = await getServerSession(authOption);

    if (!session || session.user.role !== "user") {
      return res.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    // ✅ STRICT validation
    const amount = Number(body.amount);

    if (!Number.isFinite(amount) || amount <= 0) {
      return res.json(
        { message: "Invalid amount" },
        { status: 400 }
      );
    }

    const order = await rzp.orders.create({
      amount: Math.round(amount) * 100, // ✅ safe paise conversion
      currency: "INR",
    });

    return res.json(order);
  } catch (err) {
    console.error("Razorpay Error:", err);
    return serverCatchError(err);
  }
};