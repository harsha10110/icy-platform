import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  throw new Error("❌ Missing MONGODB_URI in .env.local");
}

export async function connectDB() {
  if (mongoose.connection.readyState === 1) {
    return;
  }

  await mongoose.connect(MONGODB_URI);
  console.log("✅ Connected to MongoDB");
}
