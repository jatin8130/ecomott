import bcrypt from "bcrypt";
import serverCatchError from "@/lib/server-catch-error";
import { NextRequest, NextResponse as res } from "next/server";
import UserModel from "@/models/user.model";
import { connectDB } from "@/lib/db";

export const POST = async (req: NextRequest) => {
  try {
    await connectDB();

    const body = await req.json();
    const { email, password, provider } = body;

    const user = await UserModel.findOne({ email });

    // ❌ ALWAYS CHECK USER FIRST
    if (!user) {
      return res.json({ message: "User not found" }, { status: 404 });
    }

    // ==========================
    // GOOGLE LOGIN
    // ==========================
    if (provider === "google") {
      return res.json({
        id: user._id.toString(),
        name: user.fullname,
        email: user.email,
        role: user.role,
        address: user.address,
      });
    }

    // ==========================
    // PASSWORD LOGIN
    // ==========================
    if (!password) {
      return res.json({ message: "Password required" }, { status: 400 });
    }

    const isLogin = await bcrypt.compare(password, user.password);

    if (!isLogin) {
      return res.json({ message: "Incorrect password" }, { status: 401 });
    }

    return res.json({
      id: user._id.toString(),
      name: user.fullname,
      email: user.email,
      role: user.role,
      address: user.address,
    });
  } catch (err) {
    return serverCatchError(err);
  }
};