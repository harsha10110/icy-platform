import mongoose, { Schema, Document, Model } from "mongoose";

export interface ICampaign extends Document {
  brandId: mongoose.Types.ObjectId;
  name: string;
  objective: string;
  budget: string;
  deliverables: string;
  status: "draft" | "active" | "completed";
  createdAt: Date;
}

const CampaignSchema = new Schema<ICampaign>({
  brandId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, required: true },
  objective: { type: String, default: "" },
  budget: { type: String, default: "" },
  deliverables: { type: String, default: "" },
  status: {
    type: String,
    enum: ["draft", "active", "completed"],
    default: "draft",
  },
  createdAt: { type: Date, default: Date.now },
});

const Campaign: Model<ICampaign> =
  mongoose.models.Campaign ||
  mongoose.model<ICampaign>("Campaign", CampaignSchema);

export default Campaign;
