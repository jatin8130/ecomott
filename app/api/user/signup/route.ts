import serverCatchError from "@/lib/server-catch-error";
import { NextRequest, NextResponse as res } from "next/server";
import UserModel from "@/models/user.model";
import { connectDB } from "@/lib/db";

export const POST = async (req: NextRequest) => {
  try {
    await connectDB()
    const body = await req.json();
    // remove confirm password
    delete body.confirmPassword;

    await UserModel.create(body);
    return res.json({ message: "Signup success" });
  } catch (err) {
    return serverCatchError(err);
  }
};
