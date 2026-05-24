import serverCatchError from "@/lib/server-catch-error";
import UserModel from "@/models/user.model";
import { getServerSession } from "next-auth";

import { NextResponse as res } from "next/server";
import { authOption } from "../auth/[...nextauth]/route";
import { connectDB } from "@/lib/db";

export const GET = async () => {
  try {
    await connectDB()
    const session = await getServerSession(authOption);
    if (!session) return res.json({ message: "unauthorized" }, { status: 401 });

    if (session.user.role !== "admin")
      return res.json({ message: "unauthorized" }, { status: 401 });

    const id = session.user.id;
    const users = await UserModel.find(
      { _id: { $ne: id } },
      { password: 0 },
    ).sort({
      createdAt: -1,
    });
    return res.json(users);
  } catch (err) {
    return serverCatchError(err);
  }
};
