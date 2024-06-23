import mongoose, { Document, Schema } from "mongoose";

// Define a TypeScript interface for the Product schema
interface IProduct extends Document {
  title: string;
  description: string;
  media: string[];
  category: string;
  collections: mongoose.Types.ObjectId[];
  tags: string[];
  sizes: string[];
  colors: string[];
  price: number;
  expense: number;
  createdAt: Date;
  updatedAt: Date;
}

// Define the Product schema
const ProductSchema: Schema<IProduct> = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  media: [{ type: String }],
  category: { type: String, required: true },
  collections: [{ type: mongoose.Schema.Types.ObjectId, ref: "Collection" }],
  tags: [{ type: String }],
  sizes: [{ type: String }],
  colors: [{ type: String }],
  price: { 
    type: mongoose.Schema.Types.Decimal128, 
    get: (v: mongoose.Schema.Types.Decimal128) => parseFloat(v.toString()),
    required: true
  },
  expense: { 
    type: mongoose.Schema.Types.Decimal128, 
    get: (v: mongoose.Schema.Types.Decimal128) => parseFloat(v.toString()),
    required: true
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
}, { toJSON: { getters: true } });

// Create the Product model
const Product = mongoose.models.Product || mongoose.model<IProduct>("Product", ProductSchema);

export default Product;