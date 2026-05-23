import mongoose, { Schema, model, models } from "mongoose";
import UserModel from "./user.model";
import ProductModel from "./product.model";
import shortid from "shortid";

const orderSchema = new Schema(
  {
    orderId: {
      type: String,
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: UserModel,
      required: true,
    },
    products: [
      {
        type: mongoose.Types.ObjectId,
        ref: ProductModel,
        required: true,
      },
    ],
    prices: [
      {
        type: Number,
        required: true,
      },
    ],
    discounts: [
      {
        type: Number,
        required: true,
      },
    ],
    quantities: [
      {
        type: Number,
        required: true,
      },
    ],
    grossTotal: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      default: "processing",
      enum: ["processing", "dispatched", "returned"],
    },
  },
  { timestamps: true },
);

orderSchema.pre("save", function (next) {
  this.orderId = shortid.generate().toUpperCase();
  return next;
});

const OrderModel = models.Order || model("Order", orderSchema);
export default OrderModel;
