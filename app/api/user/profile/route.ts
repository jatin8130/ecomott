import serverCatchError from "@/lib/server-catch-error";
import UserModel from "@/models/user.model";
import { getServerSession } from "next-auth";

import { NextRequest, NextResponse as res } from "next/server";
import { authOption } from "../../auth/[...nextauth]/route";
import { connectDB } from "@/lib/db";

export const PUT = async (req: NextRequest) => {
  try {
    await connectDB()
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
