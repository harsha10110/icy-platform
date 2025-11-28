"use client";

import { useEffect, useState } from "react";

export default function DiscoverInfluencers() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const [brandId, setBrandId] = useState<string | null>(null);
  const [latestCampaign, setLatestCampaign] = useState<any | null>(null);
  const [campaignLoading, setCampaignLoading] = useState(true);

  useEffect(() => {
    // Read logged-in user (brand) from localStorage
    const storedUser = localStorage.getItem("icy_user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      if (user.role === "brand") {
        setBrandId(user.id);
      }
    }
  }, []);

  // Fetch influencers
  useEffect(() => {
    async function fetchInfluencers() {
      const res = await fetch("/api/influencer/all");
      const json = await res.json();
      setData(json.influencers || []);
      setLoading(false);
    }
    fetchInfluencers();
  }, []);

  // Fetch latest campaign for this brand (for matching + attaching to requests)
  useEffect(() => {
    if (!brandId) return;

    async function fetchLatestCampaign() {
      try {
        const res = await fetch(`/api/campaign/byBrand?brandId=${brandId}`);
        const json = await res.json();
        const campaigns = json.campaigns || [];
        // Assume campaigns are returned newest-first from the API
        setLatestCampaign(campaigns[0] || null);
      } catch (e) {
        console.error("Error fetching campaigns for matching", e);
      } finally {
        setCampaignLoading(false);
      }
    }

    fetchLatestCampaign();
  }, [brandId]);

  async function handleRequestCollab(influencerId: string, name: string) {
    if (!brandId) {
      setMessage("You must be logged in as a brand to send requests.");
      return;
    }

    let promptText = `Short message for ${name} (e.g. campaign brief, expectations):`;
    if (latestCampaign) {
      promptText += `\n\nAttached campaign: "${latestCampaign.name}"`;
    }

    const msg = prompt(promptText);

    if (msg === null) return; // cancelled

    setMessage("Sending request...");

    const res = await fetch("/api/collab/request", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        brandId,
        influencerId,
        message: msg,
        campaignId: latestCampaign?._id || null,
      }),
    });

    const data = await res.json();

    if (res.ok) {
      setMessage("Request sent ✅");
    } else {
      setMessage("Error: " + data.message);
    }
  }

  // Very simple keyword-overlap-based score between campaign and influencer
  function computeMatchScore(inf: any): number {
    if (!latestCampaign || !inf.profile) return 0;

    const textCampaign = [
      latestCampaign.name || "",
      latestCampaign.objective || "",
      latestCampaign.deliverables || "",
    ]
      .join(" ")
      .toLowerCase();

    const textInfluencer = [
      inf.profile.bio || "",
      inf.profile.niche || "",
    ]
      .join(" ")
      .toLowerCase();

    if (!textCampaign.trim() || !textInfluencer.trim()) return 0;

    const stopwords = new Set([
      "the",
      "and",
      "for",
      "with",
      "this",
      "that",
      "you",
      "your",
      "a",
      "an",
      "to",
      "of",
      "in",
      "on",
      "our",
      "we",
      "is",
      "are",
    ]);

    function tokenize(text: string): string[] {
      return text
        .split(/[^a-z0-9]+/g)
        .filter((w) => w.length > 2 && !stopwords.has(w));
    }

    const campTokens = tokenize(textCampaign);
    const infTokens = tokenize(textInfluencer);

    if (campTokens.length === 0 || infTokens.length === 0) return 0;

    const campSet = new Set(campTokens);
    let overlap = 0;

    for (const t of infTokens) {
      if (campSet.has(t)) overlap++;
    }

    const base = Math.min(campTokens.length, infTokens.length);
    if (base === 0) return 0;

    const rawScore = overlap / base;
    const percent = Math.round(Math.min(rawScore * 100, 100));

    return percent;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-300">
        Loading influencers…
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 text-slate-100 bg-slate-950">
      <h1 className="text-3xl font-semibold mb-2">Discover Influencers</h1>

      <p className="text-sm text-slate-400 mb-2">
        Browse creators, see match scores based on your latest campaign, and send collaboration requests.
      </p>

      {!campaignLoading && !latestCampaign && (
        <p className="text-xs text-amber-300 mb-4">
          You don&apos;t have any campaigns yet.{" "}
          <a
            href="/brand/campaigns"
            className="underline text-amber-200"
          >
            Create a campaign
          </a>{" "}
          to see match scores and attach briefs to requests.
        </p>
      )}

      {latestCampaign && (
        <div className="mb-4 text-xs text-slate-400">
          <span className="font-semibold text-slate-200">
            Matching against campaign:
          </span>{" "}
          {latestCampaign.name}{" "}
          <span className="text-slate-500">
            (created {new Date(latestCampaign.createdAt).toLocaleString()})
          </span>
        </div>
      )}

      {message && (
        <p className="mb-4 text-sm text-emerald-300">{message}</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.map((inf: any) => {
          const score = computeMatchScore(inf);

          return (
            <div
              key={inf.id}
              className="p-4 rounded-xl bg-slate-800 border border-slate-700 flex flex-col gap-2"
            >
              <div className="flex justify-between items-start gap-2">
                <div>
                  <h2 className="text-xl font-medium">{inf.name}</h2>
                  <p className="text-slate-400 text-xs mb-1">
                    {inf.email}
                  </p>
                </div>
                {latestCampaign && (
                  <span className="text-xs px-2 py-1 rounded-full bg-slate-900 border border-slate-600">
                    Match: {score}%
                  </span>
                )}
              </div>

              {inf.profile ? (
                <>
                  <p className="text-slate-300 text-sm mb-1 line-clamp-3">
                    {inf.profile.bio}
                  </p>
                  <p className="text-slate-400 text-sm">
                    Niche: {inf.profile.niche || "—"}
                  </p>
                  <p className="text-slate-400 text-sm">
                    Followers: {inf.profile.followers ?? "—"}
                  </p>
                </>
              ) : (
                <p className="text-slate-500 text-sm mb-2">
                  No profile yet.
                </p>
              )}

              {/* View profile link */}
              <a
                href={`/influencer/${inf.id}`}
                className="w-full text-center text-xs py-2 rounded-lg bg-slate-700 hover:bg-slate-600 border border-slate-600"
              >
                View Profile
              </a>

              {/* Request collab button */}
              <button
                className="mt-1 w-full bg-blue-600 text-sm p-2 rounded hover:bg-blue-700"
                onClick={() => handleRequestCollab(inf.id, inf.name)}
              >
                Request Collab
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
