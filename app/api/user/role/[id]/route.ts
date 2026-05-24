import serverCatchError from "@/lib/server-catch-error";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse as res } from "next/server";
import UserModel from "@/models/user.model";
import { authOption } from "@/app/api/auth/[...nextauth]/route";
import IdInterface from "@/interfaces/id.interface";
import { connectDB } from "@/lib/db";

export const PUT = async (req: NextRequest, context: IdInterface) => {
  try {
    await connectDB()
    const session = await getServerSession(authOption);

    if (!session) return res.json({ message: "Unauthorized" }, { status: 401 });

    if (session.user.role !== "admin")
      return res.json({ message: "Unauthorized" }, { status: 401 });

    const { id: userId } = await context.params;
    const body = await req.json();

    await UserModel.updateOne({ _id: userId }, { role: body.role });
    return res.json({ message: "Role changed !" });
  } catch (err) {
    return serverCatchError(err);
  }
};
