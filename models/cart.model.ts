<<<<<<< HEAD
import mongoose, { Schema, models, model } from "mongoose";
import UserModel from "./user.model";
import ProductModel from "./product.model";

const cartSchema = new Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: UserModel,
      required: true,
    },
    product: {
      type: mongoose.Types.ObjectId,
      ref: ProductModel,
      required: true,
    },
    qnt: {
      type: Number,
      default: 1,
    },
  },
  { timestamps: true },
);

const CartModel = models.Cart || model("Cart", cartSchema);
export default CartModel;
=======
import mongoose, { Schema, models, model } from "mongoose";
import UserModel from "./user.model";
import ProductModel from "./product.model";

const cartSchema = new Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: UserModel,
      required: true,
    },
    product: {
      type: mongoose.Types.ObjectId,
      ref: ProductModel,
      required: true,
    },
    qnt: {
      type: Number,
      default: 1,
    },
  },
  { timestamps: true },
);

const CartModel = models.Cart || model("Cart", cartSchema);
export default CartModel;
>>>>>>> 28ec0c03fa8749f0a6e22af9582120c326f74948
