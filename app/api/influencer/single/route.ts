import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import InfluencerProfile from "@/models/InfluencerProfile";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { message: "id is required" },
        { status: 400 }
      );
    }

    await connectDB();

    const user = await User.findById(id).lean();

    if (!user || user.role !== "influencer") {
      return NextResponse.json(
        { message: "Influencer not found" },
        { status: 404 }
      );
    }

    const profile = await InfluencerProfile.findOne({ userId: id }).lean();

    return NextResponse.json(
      {
        influencer: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          profile: profile || null,
        },
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error in /api/influencer/single:", err);
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}
