import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import InfluencerProfile from "@/models/InfluencerProfile";
import User from "@/models/User";

export async function GET() {
  try {
    await connectDB();

    // Get all influencer users
    const influencers = await User.find({ role: "influencer" });

    const influencerIds = influencers.map((u) => u._id);

    // Get matching influencer profiles
    const profiles = await InfluencerProfile.find({
      userId: { $in: influencerIds },
    });

    // Merge user + profile together for display
    const merged = influencers.map((u) => {
      const p = profiles.find((x) => x.userId.toString() === u._id.toString());
      return {
        id: u._id,
        name: u.name,
        email: u.email,
        role: u.role,
        profile: p || null,
      };
    });

    return NextResponse.json({ influencers: merged }, { status: 200 });
  } catch (err) {
    console.error("Error fetching all influencers:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
