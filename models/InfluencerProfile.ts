import mongoose, { Schema, Document, Model } from "mongoose";

export interface IInfluencerProfile extends Document {
  userId: mongoose.Types.ObjectId;
  bio: string;
  niche: string;
  instagram: string;
  youtube: string;
  followers: number;
  createdAt: Date;
  updatedAt: Date;
}

const InfluencerProfileSchema = new Schema<IInfluencerProfile>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    bio: { type: String, default: "" },
    niche: { type: String, default: "" },
    instagram: { type: String, default: "" },
    youtube: { type: String, default: "" },
    followers: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const InfluencerProfile: Model<IInfluencerProfile> =
  mongoose.models.InfluencerProfile ||
  mongoose.model<IInfluencerProfile>("InfluencerProfile", InfluencerProfileSchema);

export default InfluencerProfile;
