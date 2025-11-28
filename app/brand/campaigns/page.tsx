"use client";

import { useEffect, useState } from "react";

interface Campaign {
  _id: string;
  name: string;
  objective?: string;
  budget?: string;
  deliverables?: string;
  status?: string;
  createdAt: string;
}

export default function BrandCampaignsPage() {
  const [user, setUser] = useState<any | null>(null);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const [form, setForm] = useState({
    name: "",
    objective: "",
    budget: "",
    deliverables: "",
  });

  useEffect(() => {
    const storedUser = localStorage.getItem("icy_user");
    if (!storedUser) {
      window.location.href = "/login";
      return;
    }
    const u = JSON.parse(storedUser);
    if (u.role !== "brand") {
      window.location.href = "/dashboard";
      return;
    }
    setUser(u);
    fetchCampaigns(u.id);
  }, []);

  async function fetchCampaigns(brandId: string) {
    try {
      const res = await fetch(`/api/campaign/byBrand?brandId=${brandId}`);
      const data = await res.json();
      setCampaigns(data.campaigns || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    setMessage("");

    try {
      const res = await fetch("/api/campaign/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          brandId: user.id,
          ...form,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setMessage(data.message || "Error creating campaign.");
      } else {
        setMessage("Campaign created ✅");
        setForm({
          name: "",
          objective: "",
          budget: "",
          deliverables: "",
        });
        fetchCampaigns(user.id);
      }
    } catch (err) {
      setMessage("Network error.");
    } finally {
      setSaving(false);
    }
  }

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-300">
        Loading campaigns…
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 px-4 py-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold">Campaigns</h1>
            <p className="text-sm text-slate-400">
              Write briefs once. Use them across matching and collaboration.
            </p>
          </div>
          <a
            href="/dashboard"
            className="text-xs px-3 py-1.5 rounded-lg border border-slate-700 text-slate-300 hover:bg-slate-900"
          >
            ← Back to Dashboard
          </a>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          {/* Create campaign form */}
          <section className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-4">
            <h2 className="text-sm font-semibold">New campaign</h2>
            <p className="text-xs text-slate-400">
              Be specific. This description drives match scores and helps
              creators decide if the brief fits them.
            </p>

            {message && (
              <p className="text-xs text-emerald-300 bg-emerald-950/30 border border-emerald-900 rounded-lg px-3 py-2">
                {message}
              </p>
            )}

            <form onSubmit={handleSubmit} className="space-y-3 text-sm">
              <div>
                <label className="block text-[11px] mb-1 text-slate-400">
                  Campaign name *
                </label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg bg-slate-950 border border-slate-700 px-3 py-2 text-sm"
                  placeholder="e.g. Summer Drop UGC Launch"
                />
              </div>

              <div>
                <label className="block text-[11px] mb-1 text-slate-400">
                  Objective
                </label>
                <textarea
                  name="objective"
                  value={form.objective}
                  onChange={handleChange}
                  rows={2}
                  className="w-full rounded-lg bg-slate-950 border border-slate-700 px-3 py-2 text-sm"
                  placeholder="e.g. Drive app installs, push new collection, generate UGC..."
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] mb-1 text-slate-400">
                    Budget (optional)
                  </label>
                  <input
                    name="budget"
                    value={form.budget}
                    onChange={handleChange}
                    className="w-full rounded-lg bg-slate-950 border border-slate-700 px-3 py-2 text-sm"
                    placeholder="e.g. ₹50k–₹2L"
                  />
                </div>
                <div>
                  <label className="block text-[11px] mb-1 text-slate-400">
                    Deliverables
                  </label>
                  <input
                    name="deliverables"
                    value={form.deliverables}
                    onChange={handleChange}
                    className="w-full rounded-lg bg-slate-950 border border-slate-700 px-3 py-2 text-sm"
                    placeholder="e.g. 3 Reels + 5 Stories"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={saving}
                className="mt-1 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-sm font-medium"
              >
                {saving ? "Creating…" : "Create campaign"}
              </button>
            </form>
          </section>

          {/* Existing campaigns */}
          <section className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-4">
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-sm font-semibold">Your campaigns</h2>
              <span className="text-[11px] text-slate-500">
                {campaigns.length} total
              </span>
            </div>

            {campaigns.length === 0 ? (
              <p className="text-sm text-slate-400">
                No campaigns yet. Create one on the left and then head to{" "}
                <a
                  href="/brand/discover"
                  className="text-blue-400 underline"
                >
                  Discover
                </a>{" "}
                to see matches.
              </p>
            ) : (
              <div className="space-y-3 text-sm">
                {campaigns.map((c) => (
                  <div
                    key={c._id}
                    className="rounded-xl border border-slate-800 bg-slate-950/60 px-4 py-3"
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <p className="font-medium text-slate-100">
                        {c.name}
                      </p>
                      <span className="text-[10px] text-slate-500">
                        {new Date(c.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    {c.objective && (
                      <p className="text-xs text-slate-300 mb-1 line-clamp-2">
                        {c.objective}
                      </p>
                    )}
                    <div className="flex flex-wrap gap-3 text-[11px] text-slate-400 mt-1">
                      {c.budget && (
                        <span>Budget: {c.budget}</span>
                      )}
                      {c.deliverables && (
                        <span>Deliverables: {c.deliverables}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
