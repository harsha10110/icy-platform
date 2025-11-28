import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import CollabRequest from "@/models/CollabRequest";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { brandId, influencerId, message } = body;

    if (!brandId || !influencerId) {
      return NextResponse.json(
        { message: "brandId and influencerId are required" },
        { status: 400 }
      );
    }

    await connectDB();

    const collab = await CollabRequest.create({
      brandId,
      influencerId,
      message: message || "",
    });

    return NextResponse.json(
      { message: "Request sent", collabId: collab._id },
      { status: 201 }
    );
  } catch (err) {
    console.error("Collab request error:", err);
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}
