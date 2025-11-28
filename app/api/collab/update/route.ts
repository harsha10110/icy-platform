import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import CollabRequest from "@/models/CollabRequest";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { collabId, status } = body;

    if (!collabId || !status) {
      return NextResponse.json(
        { message: "collabId and status are required" },
        { status: 400 }
      );
    }

    if (!["accepted", "rejected"].includes(status)) {
      return NextResponse.json(
        { message: "Invalid status" },
        { status: 400 }
      );
    }

    await connectDB();

    const updated = await CollabRequest.findByIdAndUpdate(
      collabId,
      { status },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json(
        { message: "Collab request not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Status updated", request: updated },
      { status: 200 }
    );
  } catch (err) {
    console.error("Collab update error:", err);
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}
