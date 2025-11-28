"use client";

import { useEffect, useState } from "react";

export default function BrandProfilePage() {
  const [user, setUser] = useState<any | null>(null);
  const [form, setForm] = useState({
    brandName: "",
    website: "",
    industry: "",
    description: "",
    budgetRange: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

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
    fetchProfile(u.id);
  }, []);

  async function fetchProfile(userId: string) {
    try {
      const res = await fetch(`/api/brand/profile?userId=${userId}`);
      const data = await res.json();
      if (data.profile) {
        setForm({
          brandName: data.profile.brandName || "",
          website: data.profile.website || "",
          industry: data.profile.industry || "",
          description: data.profile.description || "",
          budgetRange: data.profile.budgetRange || "",
        });
      }
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
      const res = await fetch("/api/brand/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          ...form,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setMessage(data.message || "Error saving profile.");
      } else {
        setMessage("Brand profile updated ✅");
      }
    } catch (err) {
      setMessage("Network error.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-300">
        Loading brand profile…
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Brand Profile</h1>
            <p className="text-sm text-slate-400">
              This is what creators see when you reach out.
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
          <p className="mb-2 text-xs text-emerald-300 bg-emerald-950/30 border border-emerald-900 rounded-lg px-3 py-2">
            {message}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs mb-1 text-slate-400">
              Brand name
            </label>
            <input
              name="brandName"
              value={form.brandName}
              onChange={handleChange}
              className="w-full rounded-lg bg-slate-950 border border-slate-700 px-3 py-2 text-sm"
              placeholder="Name creators will recognise"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs mb-1 text-slate-400">
                Website
              </label>
              <input
                name="website"
                value={form.website}
                onChange={handleChange}
                className="w-full rounded-lg bg-slate-950 border border-slate-700 px-3 py-2 text-sm"
                placeholder="https://"
              />
            </div>
            <div>
              <label className="block text-xs mb-1 text-slate-400">
                Industry / category
              </label>
              <input
                name="industry"
                value={form.industry}
                onChange={handleChange}
                className="w-full rounded-lg bg-slate-950 border border-slate-700 px-3 py-2 text-sm"
                placeholder="D2C skincare, SaaS, fashion…"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs mb-1 text-slate-400">
              Budget range (optional)
            </label>
            <input
              name="budgetRange"
              value={form.budgetRange}
              onChange={handleChange}
              className="w-full rounded-lg bg-slate-950 border border-slate-700 px-3 py-2 text-sm"
              placeholder="e.g. ₹50k–₹2L per campaign"
            />
          </div>

          <div>
            <label className="block text-xs mb-1 text-slate-400">
              Short description
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={3}
              className="w-full rounded-lg bg-slate-950 border border-slate-700 px-3 py-2 text-sm"
              placeholder="Who you are, what you sell, and what kind of creators you usually work with."
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="mt-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-sm font-medium"
          >
            {saving ? "Saving..." : "Save brand profile"}
          </button>
        </form>
      </div>
    </div>
  );
}
