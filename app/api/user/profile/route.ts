const db = `${process.env.DB_URL}/${process.env.DB_NAME}`;
import serverCatchError from "@/lib/server-catch-error";
import UserModel from "@/models/user.model";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
mongoose.connect(db);

import { NextRequest, NextResponse as res } from "next/server";
import { authOption } from "../../auth/[...nextauth]/route";

export const PUT = async (req: NextRequest) => {
  try {
    const session = await getServerSession(authOption);

    if (!session) return res.json({ message: "Unauthorized" }, { status: 401 });

    if (session.user.role !== "user")
      return res.json({ message: "Unauthorized" }, { status: 401 });

    const id = session.user.id;
    const body = await req.json();
    delete body.email;
    delete body.role;
    delete body.password;

    const user = await UserModel.findByIdAndUpdate(id, body);

    if (!user) return res.json({ message: "User not found" }, { status: 404 });

    return res.json({ message: "Changes made successfully" });
  } catch (err) {
    return serverCatchError(err);
  }
};
