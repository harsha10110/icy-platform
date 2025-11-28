"use client";

import { useEffect, useState } from "react";

export default function InfluencerRequestsPage() {
  const [userId, setUserId] = useState<string | null>(null);
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const storedUser = localStorage.getItem("icy_user");
    if (!storedUser) {
      window.location.href = "/login";
      return;
    }
    const user = JSON.parse(storedUser);

    if (user.role !== "influencer") {
      window.location.href = "/dashboard";
      return;
    }

    setUserId(user.id);
  }, []);

  useEffect(() => {
    if (!userId) return;

    async function fetchRequests() {
      const res = await fetch(`/api/collab/inbox?userId=${userId}`);
      const data = await res.json();
      setRequests(data.requests || []);
      setLoading(false);
    }

    fetchRequests();
  }, [userId]);

  async function handleUpdateStatus(
    collabId: string,
    status: "accepted" | "rejected"
  ) {
    setMessage("Updating...");

    const res = await fetch("/api/collab/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ collabId, status }),
    });

    const data = await res.json();

    if (res.ok) {
      setRequests((prev) =>
        prev.map((r: any) =>
          r._id === collabId ? { ...r, status } : r
        )
      );
      setMessage(`Request ${status} ✅`);
    } else {
      setMessage("Error: " + data.message);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-300">
        Loading your collaboration requests…
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 px-4 py-8">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">
              Collaboration Requests
            </h1>
            <p className="text-sm text-slate-400">
              Brands that want to work with you, mapped to specific campaigns.
            </p>
          </div>
          <a
            href="/dashboard"
            className="text-xs px-3 py-1.5 rounded-lg border border-slate-700 text-slate-300 hover:bg-slate-900"
          >
            ← Back to Dashboard
          </a>
        </div>

        {message && (
          <p className="text-xs text-emerald-300 bg-emerald-950/30 border border-emerald-900 rounded-lg px-3 py-2">
            {message}
          </p>
        )}

        {requests.length === 0 ? (
          <p className="text-sm text-slate-400">
            No requests yet. Once brands start using your profile in their
            search, they&apos;ll appear here.
          </p>
        ) : (
          <div className="space-y-4">
            {requests.map((r: any) => (
              <div
                key={r._id}
                className="rounded-2xl bg-slate-900 border border-slate-800 p-4 text-sm"
              >
                <div className="flex items-start justify-between gap-4 mb-2">
                  <div>
                    <p className="text-slate-400 text-xs mb-0.5">
                      From brand:
                    </p>
                    <p className="font-medium text-slate-100">
                      {r.brandName}
                    </p>
                    <p className="text-xs text-slate-400">
                      {r.brandEmail}
                    </p>
                  </div>
                  <div className="text-right text-[11px] text-slate-500">
                    <p>
                      {new Date(r.createdAt).toLocaleString()}
                    </p>
                    <p className="mt-1">
                      Status:{" "}
                      <span className="font-semibold text-slate-200">
                        {r.status}
                      </span>
                    </p>
                  </div>
                </div>

                {r.campaignName && (
                  <p className="text-xs text-slate-300 mb-1">
                    <span className="text-slate-400">Campaign:</span>{" "}
                    <span className="font-semibold">
                      {r.campaignName}
                    </span>
                  </p>
                )}

                <p className="text-sm text-slate-200 mb-3">
                  {r.message || "No message provided."}
                </p>

                <div className="flex gap-2">
                  <button
                    className="flex-1 bg-emerald-600 text-xs sm:text-sm p-2 rounded-lg hover:bg-emerald-700 disabled:opacity-50"
                    disabled={r.status === "accepted"}
                    onClick={() => handleUpdateStatus(r._id, "accepted")}
                  >
                    Accept
                  </button>
                  <button
                    className="flex-1 bg-red-600 text-xs sm:text-sm p-2 rounded-lg hover:bg-red-700 disabled:opacity-50"
                    disabled={r.status === "rejected"}
                    onClick={() => handleUpdateStatus(r._id, "rejected")}
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
