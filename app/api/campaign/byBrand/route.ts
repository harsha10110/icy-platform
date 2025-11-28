import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Campaign from "@/models/Campaign";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const brandId = searchParams.get("brandId");

    if (!brandId) {
      return NextResponse.json(
        { message: "brandId is required" },
        { status: 400 }
      );
    }

    await connectDB();

    const campaigns = await Campaign.find({ brandId })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ campaigns }, { status: 200 });
  } catch (err) {
    console.error("Campaign list error:", err);
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}
