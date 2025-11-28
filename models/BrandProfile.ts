import mongoose, { Schema, Document, Model } from "mongoose";

export interface IBrandProfile extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  website: string;
  industry: string;
  description: string;
  budgetRange: string;
  createdAt: Date;
  updatedAt: Date;
}

const BrandProfileSchema = new Schema<IBrandProfile>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    name: { type: String, required: true },
    website: { type: String, default: "" },
    industry: { type: String, default: "" },
    description: { type: String, default: "" },
    budgetRange: { type: String, default: "" },
  },
  { timestamps: true }
);

const BrandProfile: Model<IBrandProfile> =
  mongoose.models.BrandProfile ||
  mongoose.model<IBrandProfile>("BrandProfile", BrandProfileSchema);

export default BrandProfile;
