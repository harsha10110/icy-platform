import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import BrandProfile from "@/models/BrandProfile";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, name, website, industry, description, budgetRange } = body;

    if (!userId || !name) {
      return NextResponse.json(
        { message: "userId and name are required" },
        { status: 400 }
      );
    }

    await connectDB();

    const profile = await BrandProfile.findOneAndUpdate(
      { userId },
      { name, website, industry, description, budgetRange },
      { upsert: true, new: true }
    );

    return NextResponse.json(
      { message: "Brand profile saved", profile },
      { status: 200 }
    );
  } catch (err) {
    console.error("Brand profile error (POST):", err);
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

    const profile = await BrandProfile.findOne({ userId });

    return NextResponse.json({ profile }, { status: 200 });
  } catch (err) {
    console.error("Brand profile error (GET):", err);
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}
