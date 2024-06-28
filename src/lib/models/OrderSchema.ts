import mongoose, { Document, Schema } from "mongoose";

// Define TypeScript interfaces for the schema
interface IProduct {
  product: mongoose.Schema.Types.ObjectId;
  color: string;
  size: string;
  quantity: number;
}

interface IShippingAddress {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

interface IOrder extends Document {
  customerClerkId: string;
  products: IProduct[];
  shippingAddress: IShippingAddress;
  shippingRate: string;
  totalAmount: number;
  createdAt: Date;
}

// Define the schema using the interfaces
const orderSchema: Schema = new mongoose.Schema({
  customerClerkId: { type: String, required: true },
  products: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      color: { type: String, required: true },
      size: { type: String, required: true },
      quantity: { type: Number, required: true },
    },
  ],
  shippingAddress: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true },
  },
  shippingRate: { type: String, required: true },
  totalAmount: { type: Number, required: true },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Create the model using the schema and interface
const Order = mongoose.models.Order || mongoose.model<IOrder>("Order", orderSchema);

export default Order;