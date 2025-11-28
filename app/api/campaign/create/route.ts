import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Campaign from "@/models/Campaign";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { brandId, name, objective, budget, deliverables } = body;

    if (!brandId || !name) {
      return NextResponse.json(
        { message: "brandId and name are required" },
        { status: 400 }
      );
    }

    await connectDB();

    const campaign = await Campaign.create({
      brandId,
      name,
      objective: objective || "",
      budget: budget || "",
      deliverables: deliverables || "",
      status: "draft",
    });

    return NextResponse.json(
      { message: "Campaign created", campaign },
      { status: 201 }
    );
  } catch (err) {
    console.error("Campaign create error:", err);
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}
