import mongoose from "mongoose";

const db = `${process.env.DB_URL}${process.env.DB_NAME}`;

mongoose
  .connect(db)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

import bcrypt from "bcrypt";
import serverCatchError from "@/lib/server-catch-error";
import { NextRequest, NextResponse as res } from "next/server";
import UserModel from "@/models/user.model";

export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();
    const email = body.email;
    const password = body.password;
    const provider = body?.provider || null;
    const user = await UserModel.findOne({ email });

    const payload = {
      id: user._id.toString(),
      name: user.fullname,
      email: user.email,
      role: user.role,
      address: user.address,
    };

    if (!user) return res.json({ message: "User not found" }, { status: 404 });

    if (provider === "google") return res.json(payload);

    const isLogin = await bcrypt.compare(password, user.password);

    if (!isLogin)
      return res.json({ message: "Incorrect password" }, { status: 401 });

    return res.json(payload);
  } catch (err) {
    return serverCatchError(err);
  }
};
