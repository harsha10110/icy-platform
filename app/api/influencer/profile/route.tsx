import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import InfluencerProfile from "@/models/InfluencerProfile";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, bio, niche, instagram, youtube, followers } = body;

    if (!userId) {
      return NextResponse.json(
        { message: "userId is required" },
        { status: 400 }
      );
    }

    await connectDB();

    const profile = await InfluencerProfile.findOneAndUpdate(
      { userId },
      { bio, niche, instagram, youtube, followers },
      { upsert: true, new: true }
    );

    return NextResponse.json(
      { message: "Profile saved", profile },
      { status: 200 }
    );
  } catch (err) {
    console.error("Influencer profile error (POST):", err);
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { message: "userId is required" },
        { status: 400 }
      );
    }

    await connectDB();

    const profile = await InfluencerProfile.findOne({ userId });

    return NextResponse.json({ profile }, { status: 200 });
  } catch (err) {
    console.error("Influencer profile error (GET):", err);
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}
