import mongoose, { Document, Schema, Model } from "mongoose";

// Define an interface representing a document in MongoDB.
interface ICollection extends Document {
    title: string;
    description?: string;
    image: string;
    product: mongoose.Types.ObjectId[];
}

// Create a Schema corresponding to the document interface.
const collectionSchema: Schema<ICollection> = new Schema({
    title: {
        type: String,
        required: true,
        unique: true
    },
    description: String,
    image: {
        type: String,
        required: true,
    },
    product: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product"
        }
    ]
}, {
    timestamps: true // This will automatically add createdAt and updatedAt fields
});

// Check if the model already exists before defining it
const Collection: Model<ICollection> = mongoose.models.Collection || mongoose.model<ICollection>('Collection', collectionSchema);

export default Collection;