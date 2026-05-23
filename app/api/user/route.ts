const db = `${process.env.DB_URL}/${process.env.DB_NAME}`;
import serverCatchError from "@/lib/server-catch-error";
import UserModel from "@/models/user.model";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
mongoose.connect(db);

import { NextResponse as res } from "next/server";
import { authOption } from "../auth/[...nextauth]/route";

export const GET = async () => {
  try {
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
