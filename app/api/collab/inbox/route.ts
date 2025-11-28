import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import CollabRequest from "@/models/CollabRequest";
import User from "@/models/User";
import Campaign from "@/models/Campaign";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const influencerId = searchParams.get("userId");

    if (!influencerId) {
      return NextResponse.json(
        { message: "userId is required" },
        { status: 400 }
      );
    }

    await connectDB();

    // Explicitly tell TS this is an array of any to avoid over-strict typing
    const requests = (await CollabRequest.find({ influencerId })
      .sort({ createdAt: -1 })
      .lean()) as any[];

    const brandIds = requests.map((r) => r.brandId);
    const campaignIds = requests
      .map((r) => r.campaignId)
      .filter((id) => !!id);

    const [brands, campaigns] = await Promise.all([
      User.find({ _id: { $in: brandIds } }).lean(),
      campaignIds.length
        ? Campaign.find({ _id: { $in: campaignIds } }).lean()
        : [],
    ]);

    const merged = requests.map((r) => {
      const brand = brands.find(
        (b: any) => b._id.toString() === r.brandId.toString()
      );

      const campaign = r.campaignId
        ? campaigns.find(
            (c: any) => c._id.toString() === r.campaignId.toString()
          )
        : null;

      return {
        ...r,
        brandName: brand?.name || "Unknown Brand",
        brandEmail: brand?.email || "",
        campaignName: campaign?.name || null,
      };
    });

    return NextResponse.json({ requests: merged }, { status: 200 });
  } catch (err) {
    console.error("Inbox error:", err);
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}
