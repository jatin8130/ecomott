import { Schema, model, models } from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new Schema(
  {
    fullname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
    },
    address: {
      street: { type: String, default: null },
      city: { type: String, default: null },
      state: { type: String, default: null },
      country: { type: String, default: null },
      pincode: { type: Number, default: null },
    },
  },
  { timestamps: true },
);

userSchema.pre("save", function (next) {
  this.role = "user";
  return next;
});

userSchema.pre("save", async function (next) {
  this.password = await bcrypt.hash(this.password.toString(), 12);
  return next;
});

const UserModel = models.User || model("User", userSchema);
export default UserModel;
