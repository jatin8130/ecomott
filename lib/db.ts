import mongoose from "mongoose";

const db =
  `${process.env.DB_URL}/${process.env.DB_NAME}${process.env.DB_PARAMS || ""}`;

if (!db) throw new Error("Missing MongoDB URI");

export async function connectDB() {
  if (mongoose.connection.readyState >= 1) return;

  return mongoose.connect(db);
}