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

  async function handleUpdateStatus(collabId: string, status: "accepted" | "rejected") {
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
      <div className="min-h-screen flex items-center justify-center text-slate-300">
        Loading your collaboration requests…
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 text-slate-100">
      <h1 className="text-3xl font-semibold mb-2">
        Collaboration Requests
      </h1>
      <p className="text-sm text-slate-400 mb-4">
        (Debug: Influencer Requests page)
      </p>

      {message && (
        <p className="mb-4 text-sm text-emerald-300">{message}</p>
      )}

      {requests.length === 0 ? (
        <p className="text-slate-400">No requests yet.</p>
      ) : (
        <div className="space-y-4">
          {requests.map((r: any) => (
            <div
              key={r._id}
              className="p-4 rounded-xl bg-slate-800 border border-slate-700"
            >
              <p className="text-sm text-slate-400 mb-1">
                From:{" "}
                <span className="font-medium text-slate-200">
                  {r.brandName}
                </span>{" "}
                ({r.brandEmail})
              </p>
              <p className="text-sm text-slate-300 mb-2">
                Message: {r.message || "—"}
              </p>
              <p className="text-xs text-slate-500 mb-3">
                Status:{" "}
                <span className="font-semibold">
                  {r.status}
                </span>{" "}
                • {new Date(r.createdAt).toLocaleString()}
              </p>

              <div className="flex gap-2">
                <button
                  className="flex-1 bg-emerald-600 text-sm p-2 rounded hover:bg-emerald-700 disabled:opacity-50"
                  disabled={r.status === "accepted"}
                  onClick={() => handleUpdateStatus(r._id, "accepted")}
                >
                  Accept
                </button>
                <button
                  className="flex-1 bg-red-600 text-sm p-2 rounded hover:bg-red-700 disabled:opacity-50"
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
  );
}
