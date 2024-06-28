import mongoose, { Document, Schema } from "mongoose";

// Define an interface representing a document in MongoDB.
interface ICustomer extends Document {
  clerkId: string;
  name: string;
  email: string;
  orders: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

// Create a Schema corresponding to the document interface.
const customerSchema: Schema = new mongoose.Schema({
  clerkId: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  orders: [{ type: mongoose.Schema.Types.ObjectId, ref: "Order" }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Create a Model.
const Customer = mongoose.models.Customer || mongoose.model<ICustomer>("Customer", customerSchema);

export default Customer;