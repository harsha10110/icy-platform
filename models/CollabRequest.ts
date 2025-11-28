import mongoose, { Schema, Document, Model } from "mongoose";

export interface ICollabRequest extends Document {
  brandId: mongoose.Types.ObjectId;
  influencerId: mongoose.Types.ObjectId;
  message: string;
  status: "pending" | "accepted" | "rejected";
  createdAt: Date;
}

const CollabRequestSchema = new Schema<ICollabRequest>({
  brandId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  influencerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  message: { type: String, default: "" },
  status: {
    type: String,
    enum: ["pending", "accepted", "rejected"],
    default: "pending",
  },
  createdAt: { type: Date, default: Date.now },
});

const CollabRequest: Model<ICollabRequest> =
  mongoose.models.CollabRequest ||
  mongoose.model<ICollabRequest>("CollabRequest", CollabRequestSchema);

export default CollabRequest;
