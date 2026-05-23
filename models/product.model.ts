<<<<<<< HEAD
import { Schema, model, models } from "mongoose";

const productSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    discount: {
      type: Number,
      default: 0
    },
    quantity: {
      type: Number,
      required: true
    },
    slug: {
      type: String,
    },
    image: {
        type: String,
        required: true
    }
  },
  { timestamps: true }
);

productSchema.pre('save', function(next) {
    this.slug = this.title.toLowerCase().split(" ").join('-')
    return next
})

const ProductModel = models.Product || model('Product', productSchema)
export default ProductModel
=======
import { Schema, model, models } from "mongoose";

const productSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    discount: {
      type: Number,
      default: 0
    },
    quantity: {
      type: Number,
      required: true
    },
    slug: {
      type: String,
    },
    image: {
        type: String,
        required: true
    }
  },
  { timestamps: true }
);

productSchema.pre('save', function(next) {
    this.slug = this.title.toLowerCase().split(" ").join('-')
    return next
})

const ProductModel = models.Product || model('Product', productSchema)
export default ProductModel
>>>>>>> 28ec0c03fa8749f0a6e22af9582120c326f74948
